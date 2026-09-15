import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/*
  PATCH
  Update message status

  Allowed statuses:
  - unread
  - read
  - replied
*/

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;

    const data = await request.json();
    const { status } = data;

    const allowedStatuses = [
      "unread",
      "read",
      "replied",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid message status.",
        },
        { status: 400 }
      );
    }

    const result = await db.query(
      `
        UPDATE messages
        SET status = $1
        WHERE id = $2
        RETURNING id, status
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message status updated successfully.",
      status: result.rows[0].status,
    });
  } catch (error) {
    console.error(
      "UPDATE MESSAGE STATUS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to update message.",
      },
      { status: 500 }
    );
  }
}