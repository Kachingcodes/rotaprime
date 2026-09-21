import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function GET() {
  try {
    const result = await db.query(`
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
        p.name AS position,
        a.status AS attendance
      FROM members m
      LEFT JOIN positions p
        ON m.position_id = p.id
      LEFT JOIN attendance a
        ON a.member_id = m.id
        AND a.attendance_date = CURRENT_DATE
      WHERE m.status = 'Accepted'
      ORDER BY m.firstname ASC, m.lastname ASC
    `);

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

    const { memberId, status } = body;

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

    const result = await db.query(
      `
      INSERT INTO attendance (
        member_id,
        attendance_date,
        status
      )
      VALUES ($1, CURRENT_DATE, $2)
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
      [memberId, status]
    );

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Welfare attendance POST error:", error);

    return NextResponse.json(
      { error: "Failed to save attendance." },
      { status: 500 }
    );
  }
}