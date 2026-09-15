import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request) {
  const client = await db.connect();

  try {
    const body = await request.json();
    const members = body.members;

    if (!Array.isArray(members) || members.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No members were provided for import.",
        },
        { status: 400 }
      );
    }

    // ========================================
    // Validate members
    // ========================================

    for (const member of members) {
      if (
        !member.firstname?.trim() ||
        !member.lastname?.trim() ||
        !member.email?.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Every member must have a first name, last name and email address.",
          },
          { status: 400 }
        );
      }
    }

    // ========================================
    // Get Member position
    // ========================================

    const memberPositionResult = await client.query(`
      SELECT id
      FROM positions
      WHERE LOWER(name) = 'member'
      LIMIT 1
    `);

    if (memberPositionResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "The Member position does not exist.",
        },
        { status: 500 }
      );
    }

    const memberPositionId = memberPositionResult.rows[0].id;

    // ========================================
    // Get existing member emails
    // ========================================

    const existingResult = await client.query(`
      SELECT LOWER(TRIM(email)) AS email
      FROM members
      WHERE email IS NOT NULL
    `);

    const existingEmails = new Set(
      existingResult.rows
        .map((row) => row.email)
        .filter(Boolean)
    );

    // ========================================
    // Prepare members
    // ========================================

    const newMembers = [];
    const skippedMembers = [];

    for (const member of members) {
      const email = member.email.trim().toLowerCase();

      if (existingEmails.has(email)) {
        skippedMembers.push({
          name: `${member.firstname} ${member.lastname}`,
          email,
          reason: "Email already exists",
        });

        continue;
      }

      newMembers.push({
        lastname: member.lastname.trim(),
        firstname: member.firstname.trim(),
        gender: member.gender?.trim() || null,
        phone: member.phone?.trim() || null,
        email,
        dob: member.dob?.trim() || null,
        address: member.address?.trim() || null,
        occupation: member.occupation?.trim() || null,
      });

      // Prevent duplicate emails inside the same CSV
      existingEmails.add(email);
    }

    // ========================================
    // Nothing new to import
    // ========================================

    if (newMembers.length === 0) {
      return NextResponse.json({
        success: true,
        imported: 0,
        skipped: skippedMembers.length,
        skippedMembers,
        message:
          "No new members were imported. All records already exist.",
      });
    }

    // ========================================
    // Insert members
    // ========================================

    await client.query("BEGIN");

    const memberIds = [];

    for (const member of newMembers) {
      const result = await client.query(
        `
          INSERT INTO members (
            lastname,
            firstname,
            gender,
            phone,
            email,
            dob,
            address,
            occupation,
            position_id,
            status 
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, 'Accepted'
          )
          RETURNING id
        `,
        [
          member.lastname,
          member.firstname,
          member.gender,
          member.phone,
          member.email,
          member.dob || null,
          member.address,
          member.occupation,
          memberPositionId,
        ]
      );

      memberIds.push(result.rows[0].id);
    }

    await client.query("COMMIT");

    // ========================================
    // Response
    // ========================================

    return NextResponse.json({
      success: true,
      imported: newMembers.length,
      skipped: skippedMembers.length,
      skippedMembers,
      ids: memberIds,
      message: `${newMembers.length} member${
        newMembers.length === 1 ? "" : "s"
      } imported successfully.`,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("IMPORT MEMBERS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to import members.",
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}