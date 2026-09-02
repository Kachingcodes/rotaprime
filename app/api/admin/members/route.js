import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// GET - Load all members
export async function GET() {
  try {
    const snapshot = await db
      .collection("members")
      .orderBy("createdAt", "desc")
      .get();

    const members = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),

      // Convert Firestore timestamp so it can be sent as JSON
      createdAt: doc.data().createdAt?.toDate?.().toISOString() || null,
    }));

    // Load positions from settings/system
    const settingsSnapshot = await db
      .collection("settings")
      .doc("system")
      .get();

    const settingsData = settingsSnapshot.exists
      ? settingsSnapshot.data()
      : {};

    const positions = settingsData.positions || [];

    return NextResponse.json({
      success: true,
      members,
      positions,
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
          message: "Please fill in all required fields.",
        },
        { status: 400 }
      );
    }

    // Create member document
    const memberRef = await db.collection("members").add({
      lastname: lastname.trim(),
      firstname: firstname.trim(),
      gender,
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      dob,
      address: address.trim(),
      occupation: occupation.trim(),

      // New members start as pending
      status: "pending",

      // No position initially
      position: null,

      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Member added successfully.",
        id: memberRef.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADMIN MEMBER API ERROR:", error);

    return NextResponse.json(
      {
        message: error.message || "Unable to add member.",
      },
      { status: 500 }
    );
  }
}