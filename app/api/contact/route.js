import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      phone,
      email,
      message,
    } = body;

    // Validate required fields
    if (!name || !phone || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all fields.",
        },
        { status: 400 }
      );
    }

    // Save to Firestore
    const docRef = await db.collection("messages").add({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      status: "unread",
      createdAt: new Date(),
    });

    console.log("Message saved:", docRef.id);

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully.",
      id: docRef.id,
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