"use client";

import { useState } from "react";
import {
  ShieldCheck,
  KeyRound,
} from "lucide-react";

import Positions from "./positions";
import Change from "./change";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("main");

  return (
    <main className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-rotaract">
          Administration
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Settings
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
          Manage administrative settings and your account security.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveSection("positions")}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${
            activeSection === "positions"
              ? "bg-rotaract text-white"
              : "border border-gray-200 bg-white text-gray-700 hover:border-rotaract/30 hover:text-rotaract"
          }`}
        >
          <ShieldCheck size={17} />
          Positions
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("password")}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${
            activeSection === "password"
              ? "bg-rotaract text-white"
              : "border border-gray-200 bg-white text-gray-700 hover:border-rotaract/30 hover:text-rotaract"
          }`}
        >
          <KeyRound size={17} />
          Change Password
        </button>
      </div>

      {/* Content */}
      {activeSection === "main" && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-gray-900">
            Administrative Settings
          </h2>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            Select a setting above to manage it.
          </p>
        </section>
      )}

      {activeSection === "positions" && <Positions />}

      {activeSection === "password" && (
        <Change/>
      )}
    </main>
  );
}
