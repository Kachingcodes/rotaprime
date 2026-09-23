import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

function isValidDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const memberId = searchParams.get("memberId");

if (memberId) {
  const attendanceResult = await db.query(
    `
    SELECT
      status,
      COUNT(*)::integer AS count
    FROM attendance
    WHERE member_id = $1
    GROUP BY status
    `,
    [memberId]
  );

  const summary = {
    Present: 0,
    Absent: 0,
    Late: 0,
    Excused: 0,
  };

  attendanceResult.rows.forEach((row) => {
    summary[row.status] = row.count;
  });

  const notificationResult = await db.query(
    `
    SELECT
      id,
      member_id AS "memberId",
      attendance_id AS "attendanceId",
      type,
      message,
      is_read AS "isRead",
      created_at AS "createdAt"
    FROM welfare_notifications
    WHERE member_id = $1
    ORDER BY created_at DESC
    `,
    [memberId]
  );

  return NextResponse.json({
    summary,
    notifications: notificationResult.rows,
  });
}

    const date = searchParams.get("date");

    const attendanceDate =
      date && isValidDate(date) ? date : null;

    const result = await db.query(
      `
      SELECT
        m.id,
        m.firstname,
        m.lastname,
        m.gender,
        m.phone,
        m.email,
        m.dob,
        m.occupation,
        m.address,
        m.status,
        m.position_id AS "positionId",
        p.name AS position,
        a.status AS attendance
      FROM members m
      LEFT JOIN positions p
        ON m.position_id = p.id
      LEFT JOIN attendance a
        ON a.member_id = m.id
        AND a.attendance_date = COALESCE($1::date, CURRENT_DATE)
      WHERE m.status = 'Accepted'
      ORDER BY m.firstname ASC, m.lastname ASC
      `,
      [attendanceDate]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Welfare attendance GET error:", error);

    return NextResponse.json(
      { error: "Failed to fetch welfare attendance." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const { memberId, status, attendanceDate } = body;

    if (!memberId || !status) {
      return NextResponse.json(
        { error: "Member ID and attendance status are required." },
        { status: 400 }
      );
    }

    if (!["Present", "Absent", "Late", "Excused"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid attendance status." },
        { status: 400 }
      );
    }

    if (attendanceDate && !isValidDate(attendanceDate)) {
      return NextResponse.json(
        { error: "Invalid attendance date." },
        { status: 400 }
      );
    }

    /*
      Check the existing attendance record first.

      This lets us know whether this is:
      - a new attendance record
      - an update to an existing record
      - an already-Absent record
    */
    const existingAttendance = await db.query(
      `
      SELECT
        id,
        status
      FROM attendance
      WHERE member_id = $1
        AND attendance_date = COALESCE($2::date, CURRENT_DATE)
      LIMIT 1
      `,
      [memberId, attendanceDate || null]
    );

    const previousStatus =
      existingAttendance.rows[0]?.status || null;

    /*
      Save attendance
    */
    const result = await db.query(
      `
      INSERT INTO attendance (
        member_id,
        attendance_date,
        status
      )
      VALUES (
        $1,
        COALESCE($2::date, CURRENT_DATE),
        $3
      )
      ON CONFLICT (member_id, attendance_date)
      DO UPDATE SET
        status = EXCLUDED.status,
        marked_at = CURRENT_TIMESTAMP
      RETURNING
        id,
        member_id,
        attendance_date,
        status,
        marked_at
      `,
      [memberId, attendanceDate || null, status]
    );

    const attendance = result.rows[0];

    /*
      Get the member's three most recent attendance records.
    */
    const recentAttendance = await db.query(
      `
      SELECT
        id,
        attendance_date,
        status
      FROM attendance
      WHERE member_id = $1
      ORDER BY attendance_date DESC
      LIMIT 3
      `,
      [memberId]
    );

    const records = recentAttendance.rows;

    const hasThreeConsecutiveAbsences =
      records.length === 3 &&
      records.every(
        (record) => record.status === "Absent"
      );

    /*
      Only trigger when:
      1. The newly submitted status is Absent
      2. The previous status wasn't already Absent
      3. The three most recent records are all Absent
    */
    const shouldNotify =
      status === "Absent" &&
      previousStatus !== "Absent" &&
      hasThreeConsecutiveAbsences;

    let member = null;
    let notification = null;

    if (shouldNotify) {
      /*
        Get member information
      */
      const memberResult = await db.query(
        `
        SELECT
          id,
          firstname,
          lastname
        FROM members
        WHERE id = $1
        LIMIT 1
        `,
        [memberId]
      );

      member = memberResult.rows[0] || null;

      if (member) {
        const message =
          `${member.firstname} ${member.lastname} has been absent for 3 consecutive attendance records.`;

        /*
          Create persistent notification.

          ON CONFLICT protects against duplicates.
        */
        const notificationResult = await db.query(
          `
          INSERT INTO welfare_notifications (
            member_id,
            attendance_id,
            type,
            message
          )
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (attendance_id, type)
          DO NOTHING
          RETURNING
            id,
            member_id,
            attendance_id,
            type,
            message,
            is_read,
            created_at
          `,
          [
            memberId,
            attendance.id,
            "attendance_absence_streak",
            message,
          ]
        );

        notification =
          notificationResult.rows[0] || null;
      }
    }

    return NextResponse.json(
      {
        ...attendance,

        absentStreak: hasThreeConsecutiveAbsences
          ? 3
          : 0,

        shouldNotify: Boolean(notification),

        member,

        notification,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Welfare attendance POST error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to save attendance." },
      { status: 500 }
    );
  }
}
