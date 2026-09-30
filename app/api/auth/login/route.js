import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { verifyPassword } from "../../../../lib/auth";
import { createSession } from "../../../../lib/session";

export async function POST(request) {

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const result = await db.query(
      `
      SELECT
        a.id,
        a.member_id,
        a.email,
        a.password_hash,
        a.status,
        a.account_type
      FROM accounts a
      WHERE LOWER(a.email) = LOWER($1)
      LIMIT 1
      `,
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const account = result.rows[0];

    if (account.status !== "Active") {
      return NextResponse.json(
        { error: "This account is inactive." },
        { status: 403 }
      );
    }

    const passwordValid = await verifyPassword(
      password,
      account.password_hash
    );

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    await db.query(
      `
      UPDATE accounts
      SET last_login = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      [account.id]
    );

    const token = await createSession({
      accountId: account.id,
      accountType: account.account_type,
      memberId: account.member_id,
    });

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Unable to log in." },
      { status: 500 }
    );
  }
}