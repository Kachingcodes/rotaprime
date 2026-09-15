import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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

    // Check member exists
    const memberResult = await db.query(
      `
        SELECT id
        FROM members
        WHERE id = $1
      `,
      [id]
    );

    if (memberResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Member not found.",
        },
        { status: 404 }
      );
    }

    // Allowed fields
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

    // ========================================
    // Build PostgreSQL UPDATE
    // ========================================

    const setClauses = [];
    const values = [];
    let valueIndex = 1;

    for (const field of Object.keys(cleanUpdates)) {
      let column = field;
      let value = cleanUpdates[field];

      // Position is stored as position_id
      if (field === "position") {
        column = "position_id";

        // If position is being cleared
        if (
          value === null ||
          value === "" ||
          value === "null"
        ) {
          value = null;
        } else {
          const positionResult = await db.query(
            `
              SELECT id
              FROM positions
              WHERE id = $1
            `,
            [value]
          );

          if (positionResult.rows.length === 0) {
            return NextResponse.json(
              {
                success: false,
                message: "Position not found.",
              },
              { status: 404 }
            );
          }

          value = positionResult.rows[0].id;
        }
      }

      // Clean string fields
      if (
        typeof value === "string" &&
        [
          "firstname",
          "lastname",
          "phone",
          "email",
          "address",
          "occupation",
        ].includes(field)
      ) {
        value = value.trim();
      }

      // Email should always be lowercase
      if (field === "email" && typeof value === "string") {
        value = value.toLowerCase();
      }

      setClauses.push(`${column} = $${valueIndex}`);
      values.push(value);
      valueIndex++;
    }

    values.push(id);

    const result = await db.query(
      `
        UPDATE members
        SET ${setClauses.join(", ")}
        WHERE id = $${valueIndex}
        RETURNING
          id,
          lastname,
          firstname,
          gender,
          phone,
          email,
          dob,
          occupation,
          address,
          position_id,
          status,
          created_at
      `,
      values
    );

    const member = result.rows[0];

    // Get position name
    let position = null;

    if (member.position_id) {
      const positionResult = await db.query(
        `
          SELECT name
          FROM positions
          WHERE id = $1
        `,
        [member.position_id]
      );

      position = positionResult.rows[0]?.name || null;
    }

    return NextResponse.json({
      success: true,
      message: "Member updated successfully.",
      member: {
        ...member,
        positionId: member.position_id,
        position,
        createdAt: member.created_at,
      },
    });
  } catch (error) {
    console.error("PATCH MEMBER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to update member.",
      },
      { status: 500 }
    );
  }
}