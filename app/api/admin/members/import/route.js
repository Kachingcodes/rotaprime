import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request) {
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
    // Get existing members
    // Used to prevent duplicate emails
    // ========================================

    const existingSnapshot = await db
      .collection("members")
      .get();

    const existingEmails = new Set(
      existingSnapshot.docs
        .map((doc) => doc.data().email?.toLowerCase().trim())
        .filter(Boolean)
    );

    // ========================================
    // Prepare members
    // ========================================

    const newMembers = [];

    const skippedMembers = [];

    for (const member of members) {
      const email = member.email
        .trim()
        .toLowerCase();

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

        gender: member.gender?.trim() || "",

        phone: member.phone?.trim() || "",

        email,

        dob: member.dob?.trim() || "",

        address: member.address?.trim() || "",

        occupation:
          member.occupation?.trim() || "",

        // Imported old members are
        // already existing members.
        status: "accepted",

        // They don't have a position yet.
        position: null,

        createdAt: FieldValue.serverTimestamp(),
      });

      // Prevent duplicate emails
      // inside the same CSV.
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
    // Firestore batch
    // ========================================

    const batch = db.batch();

    const memberRefs = [];

    newMembers.forEach((member) => {
      const memberRef = db
        .collection("members")
        .doc();

      batch.set(memberRef, member);

      memberRefs.push(memberRef.id);
    });

    await batch.commit();

    // ========================================
    // Response
    // ========================================

    return NextResponse.json({
      success: true,

      imported: newMembers.length,

      skipped: skippedMembers.length,

      skippedMembers,

      ids: memberRefs,

      message: `${newMembers.length} member${
        newMembers.length === 1 ? "" : "s"
      } imported successfully.`,
    });
  } catch (error) {
    console.error(
      "IMPORT MEMBERS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to import members.",
      },
      { status: 500 }
    );
  }
}