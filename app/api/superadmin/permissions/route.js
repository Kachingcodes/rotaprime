import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { getSession } from "../../../../lib/get-session";

export async function GET() {
try {
const session = await getSession();


if (!session || session.accountType !== "Super Admin") {
  return NextResponse.json(
    { error: "Unauthorized." },
    { status: 403 }
  );
}

const result = await db.query(`
  SELECT
    p.id,
    p.name,
    COALESCE(
      BOOL_OR(pp.permission = 'admin'),
      false
    ) AS "adminAccess",
    COALESCE(
      BOOL_OR(pp.permission = 'welfare'),
      false
    ) AS "welfareAccess"
  FROM positions p
  LEFT JOIN position_permissions pp
    ON pp.position_id = p.id
  WHERE LOWER(p.status) = 'active'
  GROUP BY p.id, p.name
  ORDER BY p.name ASC
`);

return NextResponse.json({
  positions: result.rows,
});


} catch (error) {
console.error("Load permissions error:", error);


return NextResponse.json(
  { error: "Unable to load permissions." },
  { status: 500 }
);

}
}

export async function PATCH(request) {
const client = await db.connect();

try {
const session = await getSession();


if (!session || session.accountType !== "Super Admin") {
  return NextResponse.json(
    { error: "Unauthorized." },
    { status: 403 }
  );
}

const body = await request.json();

const { positions } = body;

if (!Array.isArray(positions)) {
  return NextResponse.json(
    { error: "Positions are required." },
    { status: 400 }
  );
}

for (const position of positions) {
  if (
    !position.positionId ||
    typeof position.adminAccess !== "boolean" ||
    typeof position.welfareAccess !== "boolean"
  ) {
    return NextResponse.json(
      { error: "Invalid permission values." },
      { status: 400 }
    );
  }
}

await client.query("BEGIN");

for (const position of positions) {
  const { positionId, adminAccess, welfareAccess } = position;

  // Make sure the position exists.
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
    throw new Error(`Position ${positionId} not found.`);
  }

  // Remove the current permissions for this position.
  await client.query(
    `
    DELETE FROM position_permissions
    WHERE position_id = $1
    `,
    [positionId]
  );

  // Add Admin permission if enabled.
  if (adminAccess) {
    await client.query(
      `
      INSERT INTO position_permissions (
        position_id,
        permission
      )
      VALUES ($1, 'admin')
      `,
      [positionId]
    );
  }

  // Add Welfare permission if enabled.
  if (welfareAccess) {
    await client.query(
      `
      INSERT INTO position_permissions (
        position_id,
        permission
      )
      VALUES ($1, 'welfare')
      `,
      [positionId]
    );
  }
}

await client.query("COMMIT");

return NextResponse.json({
  success: true,
  message: "Permissions saved successfully.",
});

} catch (error) {
await client.query("ROLLBACK");


console.error("Save permissions error:", error);

return NextResponse.json(
  { error: "Unable to save permissions." },
  { status: 500 }
);


} finally {
client.release();
}
}
