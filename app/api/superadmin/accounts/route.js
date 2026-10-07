import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { hashPassword } from "../../../../lib/auth";

export async function POST(request) {
  const client = await db.connect();

  try {
    const {
      memberId,
      email,
      password,
      status,
      positionId,
      startDate,
      endDate,
      termStatus,
    } = await request.json();

    // -----------------------------------------
    // Basic validation
    // -----------------------------------------

    if (
      !memberId ||
      !email ||
      !password ||
      !positionId ||
      !startDate ||
      !endDate
    ) {
      return NextResponse.json(
        {
          error: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    if (new Date(endDate) < new Date(startDate)) {
      return NextResponse.json(
        {
          error: "Term end date cannot be before the start date.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // -----------------------------------------
    // Start transaction
    // -----------------------------------------

    await client.query("BEGIN");

    // -----------------------------------------
    // Check member exists
    // -----------------------------------------

    const memberResult = await client.query(
      `
      SELECT
        id,
        firstname,
        lastname
      FROM members
      WHERE id = $1
      LIMIT 1
      `,
      [memberId]
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

    // -----------------------------------------
    // Check email is not already used
    // -----------------------------------------

    const emailResult = await client.query(
      `
      SELECT id
      FROM accounts
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1
      `,
      [normalizedEmail]
    );

    if (emailResult.rows.length > 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          error: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    // -----------------------------------------
    // Check member does not already have account
    // -----------------------------------------

    const memberAccountResult = await client.query(
      `
      SELECT id
      FROM accounts
      WHERE member_id = $1
      LIMIT 1
      `,
      [memberId]
    );

    if (memberAccountResult.rows.length > 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          error: "This member already has an account.",
        },
        { status: 409 }
      );
    }

    // -----------------------------------------
    // Check position exists
    // -----------------------------------------

    const positionResult = await client.query(
      `
      SELECT id, name
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

    // -----------------------------------------
    // Hash password
    // -----------------------------------------

    const passwordHash = await hashPassword(password);

    // -----------------------------------------
    // Create account
    // -----------------------------------------

    const accountResult = await client.query(
      `
      INSERT INTO accounts (
        member_id,
        email,
        password_hash,
        status,
        account_type
      )
      VALUES ($1, $2, $3, $4, $5)
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
        memberId,
        normalizedEmail,
        passwordHash,
        status || "Active",
        "Member",
      ]
    );

    const account = accountResult.rows[0];

    // -----------------------------------------
    // Create board term
    // -----------------------------------------

    const termResult = await client.query(
      `
      INSERT INTO board_terms (
        member_id,
        position_id,
        start_date,
        end_date,
        status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        member_id,
        position_id,
        start_date,
        end_date,
        status,
        created_at
      `,
      [
        memberId,
        positionId,
        startDate,
        endDate,
        termStatus || "Active",
      ]
    );

    const boardTerm = termResult.rows[0];

    // -----------------------------------------
    // Commit transaction
    // -----------------------------------------

    await client.query("COMMIT");

    return NextResponse.json(
      {
        success: true,
        account,
        boardTerm,
      },
      { status: 201 }
    );
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Create account error:", error);

    return NextResponse.json(
      {
        error: "Unable to create account.",
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}


export async function GET() {
  try {
    const result = await db.query(
      `
      SELECT
        a.id,
        a.member_id AS "memberId",
        a.email,
        a.status,
        a.account_type AS "accountType",
        a.last_login AS "lastLogin",

        m.firstname,
        m.lastname,

        current_term.id AS "boardTermId",
        current_term.position_id AS "positionId",
        current_term.start_date AS "startDate",
        current_term.end_date AS "endDate",
        current_term.status AS "termStatus",

        p.name AS position

      FROM accounts a

      LEFT JOIN members m
        ON m.id = a.member_id

      LEFT JOIN LATERAL (
        SELECT
          bt.id,
          bt.position_id,
          bt.start_date,
          bt.end_date,
          bt.status
        FROM board_terms bt
        WHERE bt.member_id = a.member_id
        ORDER BY bt.created_at DESC
        LIMIT 1
      ) current_term
        ON true

      LEFT JOIN positions p
        ON p.id = current_term.position_id

      ORDER BY a.created_at DESC
      `
    );

    const accounts = result.rows.map((account) => ({
      id: account.id,

      name: account.memberId
        ? `${account.firstname} ${account.lastname}`
        : "Super Admin",

      email: account.email,

      accountType: account.accountType,

      memberId: account.memberId,

      position: account.position || null,
      positionId: account.positionId || null,

      boardTermId: account.boardTermId || null,
      startDate: account.startDate || null,
      endDate: account.endDate || null,
      termStatus: account.termStatus || null,

      status: account.status,

      lastLogin: account.lastLogin,
    }));

    return NextResponse.json({
      accounts,
    });
  } catch (error) {
    console.error("Get accounts error:", error);

    return NextResponse.json(
      {
        error: "Unable to load accounts.",
      },
      { status: 500 }
    );
  }
}
