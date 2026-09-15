import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ========================================
// GET - Load all messages
// ========================================

export async function GET() {
  try {
    const result = await db.query(
      `
        SELECT
          id,
          name,
          phone,
          email,
          message,
          status,
          created_at
        FROM messages
        ORDER BY created_at DESC
      `
    );

    const messages = result.rows.map((message) => ({
      id: message.id,
      name: message.name || "",
      phone: message.phone || "",
      email: message.email || "",
      message: message.message || "",
      status: message.status || "unread",
      createdAt: message.created_at
        ? new Date(message.created_at).toISOString()
        : null,
    }));

    console.log("MESSAGES FOUND:", messages);

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("GET ADMIN MESSAGES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Unable to load messages.",
      },
      { status: 500 }
    );
  }
}