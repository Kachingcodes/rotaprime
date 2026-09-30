import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";

export async function GET() {
  try {
    const membersResult = await db.query(
      `
      SELECT
        id,
        firstname,
        lastname,
        email
      FROM members
      ORDER BY firstname ASC, lastname ASC
      `
    );

    const positionsResult = await db.query(
      `
      SELECT
        id,
        name
      FROM positions
      WHERE LOWER(name) <> 'member'
      ORDER BY name ASC
      `
    );

    return NextResponse.json({
      members: membersResult.rows,
      positions: positionsResult.rows,
    });
  } catch (error) {
    console.error("Load account options error:", error);

    return NextResponse.json(
      {
        error: "Unable to load account options.",
      },
      { status: 500 }
    );
  }
}
