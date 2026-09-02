import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const updates = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Member ID is required.",
        },
        { status: 400 }
      );
    }

    const memberRef = db.collection("members").doc(id);

    const memberSnapshot = await memberRef.get();

    if (!memberSnapshot.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Member not found.",
        },
        { status: 404 }
      );
    }

    // Only update fields that were actually supplied
    const allowedFields = [
      "firstname",
      "lastname",
      "gender",
      "phone",
      "email",
      "dob",
      "address",
      "occupation",
      "status",
      "position",
    ];

    const cleanUpdates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(updates, field)) {
        cleanUpdates[field] = updates[field];
      }
    }

    if (Object.keys(cleanUpdates).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid fields to update.",
        },
        { status: 400 }
      );
    }

    await memberRef.update(cleanUpdates);

    return NextResponse.json({
      success: true,
      message: "Member updated successfully.",
      member: {
        id,
        ...cleanUpdates,
      },
    });

  } catch (error) {
    console.error("PATCH MEMBER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Unable to update member.",
      },
      { status: 500 }
    );
  }
}