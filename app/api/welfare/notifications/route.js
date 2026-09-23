import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function GET() {
  try {
    const result = await db.query(`
      SELECT
        n.id,
        n.member_id AS "memberId",
        n.attendance_id AS "attendanceId",
        n.type,
        n.message,
        n.is_read AS "isRead",
        n.created_at AS "createdAt",
        m.firstname,
        m.lastname
      FROM welfare_notifications n
      INNER JOIN members m
        ON n.member_id = m.id
      ORDER BY n.created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(
      "Welfare notifications GET error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to fetch welfare notifications." },
      { status: 500 }
    );
  }
}


export async function PATCH(request) {
  try {
    const body = await request.json();

    const { notificationId, markAll } = body;

    if (markAll) {
      await db.query(`
        UPDATE welfare_notifications
        SET is_read = TRUE
        WHERE is_read = FALSE
      `);

      return NextResponse.json({
        success: true,
      });
    }

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required." },
        { status: 400 }
      );
    }

    const result = await db.query(
      `
      UPDATE welfare_notifications
      SET is_read = TRUE
      WHERE id = $1
      RETURNING
        id,
        is_read AS "isRead"
      `,
      [notificationId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Notification not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(
      "Welfare notifications PATCH error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to update notification." },
      { status: 500 }
    );
  }
}