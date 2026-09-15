import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Load all members
export async function GET() {
  try {
    const result = await db.query(`
      SELECT
        m.id,
        m.lastname,
        m.firstname,
        m.gender,
        m.phone,
        m.email,
        m.dob,
        m.occupation,
        m.address,
        m.position_id,
        p.name AS position,
        m.status,
        m.created_at
      FROM members m
      LEFT JOIN positions p
        ON m.position_id = p.id
      ORDER BY m.created_at DESC
    `);

    const positionsResult = await db.query(`
      SELECT id, name, status
      FROM positions
      ORDER BY id ASC
    `);

    const members = result.rows.map((member) => ({
      id: member.id,
      lastname: member.lastname,
      firstname: member.firstname,
      gender: member.gender,
      phone: member.phone,
      email: member.email,
      dob: member.dob,
      occupation: member.occupation,
      address: member.address,
      positionId: member.position_id,
      position: member.position,
      status: member.status,
      createdAt: member.created_at,
    }));

    return NextResponse.json({
      success: true,
      members,
      positions: positionsResult.rows,
    });
  } catch (error) {
    console.error("GET MEMBERS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to load members.",
      },
      { status: 500 }
    );
  }
}


// POST - Add a new member
export async function POST(request) {
  try {
    const data = await request.json();

    const {
      lastname,
      firstname,
      gender,
      phone,
      email,
      dob,
      address,
      occupation,
    } = data;

    // Validate required fields
    if (
      !lastname ||
      !firstname ||
      !gender ||
      !phone ||
      !email ||
      !dob ||
      !address ||
      !occupation
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields.",
        },
        { status: 400 }
      );
    }

    // Find the Member position
    const memberPosition = await db.query(
      `
        SELECT id
        FROM positions
        WHERE LOWER(name) = 'member'
        LIMIT 1
      `
    );

    if (memberPosition.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "The Member position does not exist.",
        },
        { status: 500 }
      );
    }

    const memberPositionId = memberPosition.rows[0].id;

    // Create member
    const result = await db.query(
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
          position_id
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9
        )
        RETURNING
          id,
          lastname,
          firstname,
          gender,
          phone,
          email,
          dob,
          address,
          occupation,
          position_id,
          status,
          created_at
      `,
      [
        lastname.trim(),
        firstname.trim(),
        gender,
        phone.trim(),
        email.trim().toLowerCase(),
        dob,
        address.trim(),
        occupation.trim(),
        memberPositionId,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Member added successfully.",
        member: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADMIN MEMBER API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to add member.",
      },
      { status: 500 }
    );
  }
}