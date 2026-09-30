import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { getSession } from "../../../../lib/get-session";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const result = await db.query(
      `
      SELECT
        a.id,
        a.member_id AS "memberId",
        a.email,
        a.last_login AS "lastLogin",
        a.account_type AS "accountType",

        m.firstname,
        m.lastname,

        p.name AS position

      FROM accounts a

      LEFT JOIN members m
        ON m.id = a.member_id

      LEFT JOIN LATERAL (
        SELECT
          bt.position_id
        FROM board_terms bt
        WHERE
          bt.member_id = a.member_id
          AND LOWER(bt.status) = 'active'
        ORDER BY
          bt.start_date DESC,
          bt.created_at DESC
        LIMIT 1
      ) current_term
        ON true

      LEFT JOIN positions p
        ON p.id = current_term.position_id

      WHERE a.id = $1

      LIMIT 1
      `,
      [session.accountId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Account was not found." },
        { status: 404 }
      );
    }

    const account = result.rows[0];

    return NextResponse.json({
      user: {
        id: account.id,

        name: account.memberId
          ? `${account.firstname} ${account.lastname}`
          : "Administrator",

        email: account.email,

        lastLogin: account.lastLogin,

        accountType: account.accountType,

        position: account.memberId
          ? account.position || null
          : "Super Admin",
      },
    });
  } catch (error) {
    console.error(
      "GET CURRENT ACCOUNT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load account information.",
      },
      { status: 500 }
    );
  }
}
