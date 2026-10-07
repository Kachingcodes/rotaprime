import { cookies } from "next/headers";
import { db } from "./db";
import { verifySession } from "./session";

export async function getSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get("session")?.value;

  if (!token) {
    return null;
  }

  const session = await verifySession(token);

  if (!session) {
    return null;
  }

  // --------------------------------------------------
  // Get the current account from the database
  // --------------------------------------------------

  if (!session.accountId) {
    return null;
  }

  try {
    const result = await db.query(
      `
      SELECT
        id,
        member_id AS "memberId",
        email,
        status,
        account_type AS "accountType"
      FROM accounts
      WHERE id = $1
      LIMIT 1
      `,
      [session.accountId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const account = result.rows[0];

    // --------------------------------------------------
    // Account must currently be Active
    // --------------------------------------------------

    if (account.status !== "Active") {
      return null;
    }

    return {
      ...session,
      accountId: account.id,
      memberId: account.memberId,
      email: account.email,
      status: account.status,
      accountType: account.accountType,
    };
  } catch (error) {
    console.error("Get session error:", error);

    return null;
  }
}
