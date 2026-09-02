"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";


export default function JoinPage() {
  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    gender: "",
    phone: "",
    email: "",
    dob: "",
    address: "",
    occupation: "",

    status: "pending",
    position: "null",

  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
  e.preventDefault();

  setLoading(true);
  setError("");

  try {
    const response = await fetch("/api/membership", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const text = await response.text();

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      throw new Error(
        "The server returned an invalid response. Please check your terminal for the error."
      );
    }

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong.");
    }

    toast.success(
    "Welcome to Rotaract Lagos Prime! 🎉 You have successfully joined. We will contact you soon."
    );

    // Give the user enough time to see the toast
    setTimeout(() => {
    window.location.href = "/";
    }, 3200);

  } catch (error) {
    console.error("FORM SUBMISSION ERROR:", error);

    toast.error(
      error.message ||
        "Unable to submit your application. Please try again."
    );

    setLoading(false);
  }
}


  return (
    <main className="min-h-screen bg-hero px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Back to home */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
        >
          ← Back to home
        </Link>

        {/* Header */}
        <div className="mb-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-rotaract">
            Join Rotaract Lagos Prime
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Become a member.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            Join a community of young leaders committed to creating positive
            change and making a lasting impact in our community.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-2">

            {/* Lastname */}
            <div>
              <label
                htmlFor="lastname"
                className="mb-2 block text-sm font-medium"
              >
                Last Name
              </label>

              <input
                id="lastname"
                name="lastname"
                type="text"
                value={formData.lastname}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-rotaract"
                placeholder="Enter your last name"
              />
            </div>

            {/* Firstname */}
            <div>
              <label
                htmlFor="firstname"
                className="mb-2 block text-sm font-medium"
              >
                First Name
              </label>

              <input
                id="firstname"
                name="firstname"
                type="text"
                value={formData.firstname}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-rotaract"
                placeholder="Enter your first name"
              />
            </div>

            {/* Gender */}
            <div>
              <label
                htmlFor="gender"
                className="mb-2 block text-sm font-medium"
              >
                Gender
              </label>

              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-rotaract"
              >
                <option value="" className="text-black">
                  Select gender
                </option>
                <option value="Male" className="text-black">
                  Male
                </option>
                <option value="Female" className="text-black">
                  Female
                </option>
                <option value="Prefer not to say" className="text-black">
                  Prefer not to say
                </option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium"
              >
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-rotaract"
                placeholder="08012345678"
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-rotaract"
                placeholder="you@example.com"
              />
            </div>

            {/* DOB */}
            <div>
              <label
                htmlFor="dob"
                className="mb-2 block text-sm font-medium"
              >
                Date of Birth
              </label>

              <input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-rotaract"
              />
            </div>

            {/* Occupation */}
            <div>
              <label
                htmlFor="occupation"
                className="mb-2 block text-sm font-medium"
              >
                Occupation
              </label>

              <input
                id="occupation"
                name="occupation"
                type="text"
                value={formData.occupation}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-rotaract"
                placeholder="e.g. Student, Engineer"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-medium"
              >
                Address
              </label>

              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={4}
                className="w-full resize-none rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-rotaract"
                placeholder="Enter your residential address"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-full bg-rotaract px-6 py-4 text-sm font-bold transition hover:bg-rotaract-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "SUBMITTING..." : "SUBMIT APPLICATION →"}
          </button>

          <p className="mt-4 text-center text-xs text-white/40">
            By submitting this form, you are expressing your interest in
            joining Rotaract Lagos Prime.
          </p>
        </form>
      </div>
    </main>
  );
}