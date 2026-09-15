import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      phone,
      email,
      message,
    } = body;

    if (!name || !phone || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all fields.",
        },
        { status: 400 }
      );
    }

    const result = await db.query(
      `INSERT INTO messages
        (name, phone, email, message)
       VALUES
        ($1, $2, $3, $4)
       RETURNING id, status, created_at`,
      [
        name.trim(),
        phone.trim(),
        email.trim().toLowerCase(),
        message.trim(),
      ]
    );

    const savedMessage = result.rows[0];

    console.log("Message saved:", savedMessage.id);

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully.",
      id: savedMessage.id,
      status: savedMessage.status,
    });
  } catch (error) {
    console.error("MESSAGE API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Unable to send your message.",
      },
      { status: 500 }
    );
  }
}