import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// ========================================
// GET - Load positions
// ========================================

export async function GET() {
  try {
    const systemRef = db
      .collection("settings")
      .doc("system");

    const snapshot = await systemRef.get();

    if (!snapshot.exists) {
      return NextResponse.json({
        success: true,
        positions: [],
      });
    }

    const data = snapshot.data();

    return NextResponse.json({
      success: true,
      positions: data.positions || [],
    });
  } catch (error) {
    console.error("GET POSITIONS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Unable to load positions.",
      },
      { status: 500 }
    );
  }
}


// ========================================
// POST - Add position
// ========================================

export async function POST(request) {
  try {
    const data = await request.json();

    const name = data.name?.trim();

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Position name is required.",
        },
        { status: 400 }
      );
    }

    const systemRef = db
      .collection("settings")
      .doc("system");

    const snapshot = await systemRef.get();

    const existingPositions =
      snapshot.exists
        ? snapshot.data().positions || []
        : [];

    // Prevent duplicate names
    const alreadyExists = existingPositions.some(
      (position) =>
        position.name?.toLowerCase() ===
        name.toLowerCase()
    );

    if (alreadyExists) {
      return NextResponse.json(
        {
          success: false,
          message: "This position already exists.",
        },
        { status: 409 }
      );
    }

    const position = {
      id: `position_${Date.now()}`,
      name,
      active: true,
    };

    const updatedPositions = [
      ...existingPositions,
      position,
    ];

    await systemRef.set(
      {
        positions: updatedPositions,
      },
      { merge: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Position added successfully.",
        position,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADD POSITION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Unable to add position.",
      },
      { status: 500 }
    );
  }
}