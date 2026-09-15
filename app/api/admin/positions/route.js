import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ========================================
// GET - Load all positions
// ========================================

export async function GET() {
  try {
    const result = await db.query(
      `
        SELECT id, name
        FROM positions
        ORDER BY id ASC
      `
    );

    return NextResponse.json({
      success: true,
      positions: result.rows,
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
// POST - Add a new position
// ========================================

export async function POST(request) {
  try {
    const data = await request.json();

    const name = data.name?.trim();

    // Validate required field
    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Position name is required.",
        },
        { status: 400 }
      );
    }

    // Check for duplicate position name
    const existingPosition = await db.query(
      `
        SELECT id
        FROM positions
        WHERE LOWER(name) = LOWER($1)
        LIMIT 1
      `,
      [name]
    );

    if (existingPosition.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "This position already exists.",
        },
        { status: 409 }
      );
    }

    // Create position
    const result = await db.query(
      `
        INSERT INTO positions (name)
        VALUES ($1)
        RETURNING id, name
      `,
      [name]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Position added successfully.",
        position: result.rows[0],
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
