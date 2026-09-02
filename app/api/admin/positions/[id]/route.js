import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";


// ========================================
// PATCH - Activate / deactivate position
// ========================================

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;

    const data = await request.json();

    if (typeof data.active !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "Active status must be true or false.",
        },
        { status: 400 }
      );
    }

    const systemRef = db
      .collection("settings")
      .doc("system");

    const snapshot = await systemRef.get();

    if (!snapshot.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "System settings not found.",
        },
        { status: 404 }
      );
    }

    const positions = snapshot.data().positions || [];

    const positionExists = positions.some(
      (position) => position.id === id
    );

    if (!positionExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Position not found.",
        },
        { status: 404 }
      );
    }

    const updatedPositions = positions.map(
      (position) =>
        position.id === id
          ? {
              ...position,
              active: data.active,
            }
          : position
    );

    await systemRef.update({
      positions: updatedPositions,
    });

    const updatedPosition = updatedPositions.find(
      (position) => position.id === id
    );

    return NextResponse.json({
      success: true,
      message: `Position ${
        data.active ? "activated" : "deactivated"
      } successfully.`,
      position: updatedPosition,
    });
  } catch (error) {
    console.error("UPDATE POSITION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to update position.",
      },
      { status: 500 }
    );
  }
}