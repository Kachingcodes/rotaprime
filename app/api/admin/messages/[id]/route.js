import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

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

    const messageRef = db
      .collection("messages")
      .doc(id);

    const messageSnapshot =
      await messageRef.get();

    if (!messageSnapshot.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found.",
        },
        { status: 404 }
      );
    }

    await messageRef.update({
      status,
    });

    return NextResponse.json({
      success: true,
      message: "Message status updated successfully.",
      status,
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