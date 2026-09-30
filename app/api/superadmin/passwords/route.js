import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { hashPassword } from "../../../../lib/auth";
import { getSession } from "../../../../lib/get-session";

export async function PATCH(request) {
  try {
    // -----------------------------------------
    // Verify logged-in session
    // -----------------------------------------

    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    // -----------------------------------------
    // Verify Super Admin
    // -----------------------------------------

    if (session.accountType !== "Super Admin") {
      return NextResponse.json(
        {
          error: "You do not have permission to reset passwords.",
        },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // Read request
    // -----------------------------------------

    const { accountId, newPassword } =
      await request.json();

    // -----------------------------------------
    // Basic validation
    // -----------------------------------------

    if (!accountId || !newPassword) {
      return NextResponse.json(
        {
          error: "Account and new password are required.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Check account exists
    // -----------------------------------------

    const accountResult = await db.query(
      `
      SELECT
        id,
        email,
        status,
        account_type
      FROM accounts
      WHERE id = $1
      LIMIT 1
      `,
      [accountId]
    );

    if (accountResult.rows.length === 0) {
      return NextResponse.json(
        {
          error: "Account was not found.",
        },
        { status: 404 }
      );
    }

    const account = accountResult.rows[0];

    // -----------------------------------------
    // Hash new password
    // -----------------------------------------

    const passwordHash =
      await hashPassword(newPassword);

    // -----------------------------------------
    // Update password
    // -----------------------------------------

    await db.query(
      `
      UPDATE accounts
      SET
        password_hash = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [passwordHash, account.id]
    );

    return NextResponse.json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      {
        error: "Unable to reset password.",
      },
      { status: 500 }
    );
  }
}