import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import {
  hashPassword,
  verifyPassword,
} from "../../../../lib/auth";
import { getSession } from "../../../../lib/get-session";

export async function PATCH(request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const {
      currentPassword,
      newPassword,
    } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          error:
            "Current password and new password are required.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          error:
            "New password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        {
          error:
            "Your new password must be different from your current password.",
        },
        { status: 400 }
      );
    }

    const accountResult = await db.query(
      `
      SELECT
        id,
        password_hash,
        status
      FROM accounts
      WHERE id = $1
      LIMIT 1
      `,
      [session.accountId]
    );

    if (accountResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Account was not found." },
        { status: 404 }
      );
    }

    const account = accountResult.rows[0];

    if (account.status !== "Active") {
      return NextResponse.json(
        { error: "Your account is not active." },
        { status: 403 }
      );
    }

    const passwordMatches = await verifyPassword(
      currentPassword,
      account.password_hash
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(
      newPassword
    );

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
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error(
      "CHANGE PASSWORD ERROR:",
      error
    );

    return NextResponse.json(
      { error: "Unable to change password." },
      { status: 500 }
    );
  }
}
