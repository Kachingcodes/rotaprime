import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { getSession } from "../../../../../lib/get-session";


/*
|--------------------------------------------------------------------------
| PATCH
|--------------------------------------------------------------------------
| Handles:
| - Edit account
| - Activate account
| - Deactivate account
| - Update board position
| - Update board term dates/status
*/
export async function PATCH(request, { params }) {
  const client = await db.connect();

  try {
    // --------------------------------------------------
    // Verify Super Admin
    // --------------------------------------------------

    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    if (session.accountType !== "Super Admin") {
      return NextResponse.json(
        {
          error: "Super Admin access required.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // Get account ID
    // --------------------------------------------------

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Account ID is required.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      memberId,
      email,
      status,
      positionId,
      startDate,
      endDate,
      termStatus,
    } = body;

    // --------------------------------------------------
    // Start transaction
    // --------------------------------------------------

    await client.query("BEGIN");

    // --------------------------------------------------
    // Get existing account
    // --------------------------------------------------

    const accountResult = await client.query(
      `
      SELECT
        id,
        member_id,
        email,
        status,
        account_type
      FROM accounts
      WHERE id = $1
      LIMIT 1
      `,
      [id]
    );

    if (accountResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          error: "Account not found.",
        },
        { status: 404 }
      );
    }

    const existingAccount = accountResult.rows[0];

    // --------------------------------------------------
    // Do not modify a Super Admin through this route
    // --------------------------------------------------

    if (existingAccount.account_type === "Super Admin") {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          error: "The Super Admin account cannot be modified here.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // Normalize email
    // --------------------------------------------------

    const normalizedEmail =
      typeof email === "string"
        ? email.trim().toLowerCase()
        : existingAccount.email;

    // --------------------------------------------------
    // Validate email
    // --------------------------------------------------

    if (!normalizedEmail) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          error: "Email is required.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Check email is not being used by another account
    // --------------------------------------------------

    const emailResult = await client.query(
      `
      SELECT id
      FROM accounts
      WHERE LOWER(email) = LOWER($1)
        AND id <> $2
      LIMIT 1
      `,
      [normalizedEmail, id]
    );

    if (emailResult.rows.length > 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          error: "Another account is already using this email.",
        },
        { status: 409 }
      );
    }

    // --------------------------------------------------
    // Determine member
    // --------------------------------------------------

    const updatedMemberId =
      memberId !== undefined
        ? memberId || null
        : existingAccount.member_id;

    if (!updatedMemberId) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          error: "A member must be assigned to this account.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Verify member exists
    // --------------------------------------------------

    const memberResult = await client.query(
      `
      SELECT id
      FROM members
      WHERE id = $1
      LIMIT 1
      `,
      [updatedMemberId]
    );

    if (memberResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          error: "Selected member was not found.",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // Verify position if supplied
    // --------------------------------------------------

    if (positionId !== undefined && positionId) {
      const positionResult = await client.query(
        `
        SELECT id
        FROM positions
        WHERE id = $1
        LIMIT 1
        `,
        [positionId]
      );

      if (positionResult.rows.length === 0) {
        await client.query("ROLLBACK");

        return NextResponse.json(
          {
            error: "Selected board position was not found.",
          },
          { status: 404 }
        );
      }
    }

    // --------------------------------------------------
    // Validate term dates
    // --------------------------------------------------

    if (startDate && endDate) {
      if (new Date(endDate) < new Date(startDate)) {
        await client.query("ROLLBACK");

        return NextResponse.json(
          {
            error: "Term end date cannot be before the start date.",
          },
          { status: 400 }
        );
      }
    }

    // --------------------------------------------------
    // Update account
    // --------------------------------------------------

    const accountUpdateResult = await client.query(
      `
      UPDATE accounts
      SET
        member_id = $1,
        email = $2,
        status = COALESCE($3, status),
        updated_at = NOW()
      WHERE id = $4
      RETURNING
        id,
        member_id,
        email,
        status,
        account_type,
        last_login,
        created_at,
        updated_at
      `,
      [
        updatedMemberId,
        normalizedEmail,
        status || null,
        id,
      ]
    );

    const updatedAccount = accountUpdateResult.rows[0];

    // --------------------------------------------------
    // Find latest board term
    // --------------------------------------------------

    const termResult = await client.query(
      `
      SELECT
        id,
        member_id,
        position_id,
        start_date,
        end_date,
        status
      FROM board_terms
      WHERE member_id = $1
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [existingAccount.member_id]
    );

    const existingTerm = termResult.rows[0];

    // --------------------------------------------------
    // Update board term
    // --------------------------------------------------

    if (existingTerm) {
      await client.query(
        `
        UPDATE board_terms
        SET
          member_id = $1,
          position_id = COALESCE($2, position_id),
          start_date = COALESCE($3, start_date),
          end_date = COALESCE($4, end_date),
          status = COALESCE($5, status)
        WHERE id = $6
        `,
        [
          updatedMemberId,
          positionId || null,
          startDate || null,
          endDate || null,
          termStatus || null,
          existingTerm.id,
        ]
      );
    } else if (
      positionId &&
      startDate &&
      endDate
    ) {
      await client.query(
        `
        INSERT INTO board_terms (
          member_id,
          position_id,
          start_date,
          end_date,
          status
        )
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          updatedMemberId,
          positionId,
          startDate,
          endDate,
          termStatus || "Active",
        ]
      );
    }

    // --------------------------------------------------
    // Commit
    // --------------------------------------------------

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      account: updatedAccount,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Update account error:", error);

    return NextResponse.json(
      {
        error: "Unable to update account.",
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}


/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
| Deletes:
| - The account
| - Its associated board term(s)
|
| The operation is transactional.
*/
export async function DELETE(request, { params }) {
  const client = await db.connect();

  try {
    // --------------------------------------------------
    // Verify Super Admin
    // --------------------------------------------------

    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    if (session.accountType !== "Super Admin") {
      return NextResponse.json(
        {
          error: "Super Admin access required.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // Get account ID
    // --------------------------------------------------

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Account ID is required.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Start transaction
    // --------------------------------------------------

    await client.query("BEGIN");

    // --------------------------------------------------
    // Get account
    // --------------------------------------------------

    const accountResult = await client.query(
      `
      SELECT
        id,
        member_id,
        account_type
      FROM accounts
      WHERE id = $1
      LIMIT 1
      `,
      [id]
    );

    if (accountResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          error: "Account not found.",
        },
        { status: 404 }
      );
    }

    const account = accountResult.rows[0];

    // --------------------------------------------------
    // Never delete Super Admin
    // --------------------------------------------------

    if (account.account_type === "Super Admin") {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          error: "The Super Admin account cannot be deleted.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // Delete board terms
    // --------------------------------------------------

    if (account.member_id) {
      await client.query(
        `
        DELETE FROM board_terms
        WHERE member_id = $1
        `,
        [account.member_id]
      );
    }

    // --------------------------------------------------
    // Delete account
    // --------------------------------------------------

    await client.query(
      `
      DELETE FROM accounts
      WHERE id = $1
      `,
      [id]
    );

    // --------------------------------------------------
    // Commit
    // --------------------------------------------------

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully.",
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Delete account error:", error);

    return NextResponse.json(
      {
        error: "Unable to delete account.",
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
