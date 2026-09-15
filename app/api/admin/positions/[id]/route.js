import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ========================================
// PATCH - Update position
// ========================================

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const name = data.name?.trim();
    const status = data.status;

    // Update status only
    if (status !== undefined) {
      if (!["active", "inactive"].includes(status)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid position status.",
          },
          { status: 400 }
        );
      }

      // Member must always remain active
      const positionResult = await db.query(
        `
          SELECT id, name
          FROM positions
          WHERE id = $1
        `,
        [id]
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

      if (
        positionResult.rows[0].name.toLowerCase() === "member" &&
        status === "inactive"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "The Member position cannot be deactivated.",
          },
          { status: 400 }
        );
      }

      const result = await db.query(
        `
          UPDATE positions
          SET status = $1
          WHERE id = $2
          RETURNING id, name, status
        `,
        [status, id]
      );

      return NextResponse.json({
        success: true,
        message: "Position status updated successfully.",
        position: result.rows[0],
      });
    }

    // Update position name
    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Position name is required.",
        },
        { status: 400 }
      );
    }

    const existingPosition = await db.query(
      `
        SELECT id
        FROM positions
        WHERE LOWER(name) = LOWER($1)
        AND id != $2
        LIMIT 1
      `,
      [name, id]
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

    const result = await db.query(
      `
        UPDATE positions
        SET name = $1
        WHERE id = $2
        RETURNING id, name, status
      `,
      [name, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Position not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Position updated successfully.",
      position: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE POSITION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Unable to update position.",
      },
      { status: 500 }
    );
  }
}

// ========================================
// DELETE - Delete position
// ========================================

export async function DELETE(request, { params }) {
  const client = await db.connect();

  try {
    const { id } = await params;

    await client.query("BEGIN");

    // Find the position being deleted
    const positionResult = await client.query(
      `
        SELECT id, name
        FROM positions
        WHERE id = $1
        FOR UPDATE
      `,
      [id]
    );

    if (positionResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          success: false,
          message: "Position not found.",
        },
        { status: 404 }
      );
    }

    const position = positionResult.rows[0];

    // Prevent deletion of the default Member position
    if (position.name.toLowerCase() === "member") {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          success: false,
          message: "The Member position cannot be deleted.",
        },
        { status: 400 }
      );
    }

    // Find the Member position
    const memberPositionResult = await client.query(
      `
        SELECT id
        FROM positions
        WHERE LOWER(name) = 'member'
        LIMIT 1
        FOR UPDATE
      `
    );

    if (memberPositionResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          success: false,
          message:
            "The Member position does not exist.",
        },
        { status: 500 }
      );
    }

    const memberPositionId =
      memberPositionResult.rows[0].id;

    // Move affected members to Member
    await client.query(
      `
        UPDATE members
        SET position_id = $1
        WHERE position_id = $2
      `,
      [memberPositionId, id]
    );

    // Delete the position
    await client.query(
      `
        DELETE FROM positions
        WHERE id = $1
      `,
      [id]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: "Position deleted successfully.",
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("DELETE POSITION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Unable to delete position.",
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
