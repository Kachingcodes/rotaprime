import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      lastname,
      firstname,
      gender,
      phone,
      email,
      dob,
      address,
      occupation,
    } = body;

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
          message: "Please complete all fields.",
        },
        { status: 400 }
      );
    }

    const result = await db.query(
      `INSERT INTO members
        (lastname, firstname, gender, phone, email, dob, address, occupation)
       VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, status, created_at`,
      [
        lastname.trim(),
        firstname.trim(),
        gender,
        phone.trim(),
        email.trim().toLowerCase(),
        dob,
        address.trim(),
        occupation.trim(),
      ]
    );

    const member = result.rows[0];

    console.log("Member saved:", member.id);

    return NextResponse.json(
      {
        success: true,
        message: "Membership application submitted successfully.",
        id: member.id,
        status: member.status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("MEMBERSHIP API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Unable to save membership application.",
      },
      { status: 500 }
    );
  }
}