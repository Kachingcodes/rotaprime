import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

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

    const docRef = await db.collection("members").add({
      lastname: lastname.trim(),
      firstname: firstname.trim(),
      gender,
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      dob,
      address: address.trim(),
      occupation: occupation.trim(),
      status: "pending",
      createdAt: new Date(),
    });

    console.log("Member saved:", docRef.id);

    return NextResponse.json(
      {
        success: true,
        message: "Membership application submitted successfully.",
        id: docRef.id,
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