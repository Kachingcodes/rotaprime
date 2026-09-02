import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const snapshot = await db
      .collection("messages")
      .get();

    const messages = snapshot.docs
      .map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          message: data.message || "",
          status: data.status || "unread",

          createdAt:
            data.createdAt?.toDate?.()?.toISOString() || null,
        };
      })
      .sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;

        return (
          new Date(b.createdAt) -
          new Date(a.createdAt)
        );
      });

    console.log("MESSAGES FOUND:", messages);

    return NextResponse.json({
      success: true,
      messages,
    });

  } catch (error) {
    console.error(
      "GET ADMIN MESSAGES ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to load messages.",
      },
      { status: 500 }
    );
  }
}