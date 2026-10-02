"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
ShieldCheck,
LayoutDashboard,
HeartHandshake,
Moon,
Sun,
Save,
ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";

export default function SystemSettingsPage() {

const [settings, setSettings] = useState({
clubName: "Rotaract Lagos Prime",
clubEmail: "[info@rotaractlagosprime.org](mailto:info@rotaractlagosprime.org)",
clubPhone: "+234 800 000 0000",
clubAddress: "Lagos, Nigeria",
rotaryYear: "2026–2027",
startDate: "2026-07-01",
endDate: "2027-06-30",
});

const [saving, setSaving] = useState(false);

function handleChange(event) {
const { name, value } = event.target;

setSettings((current) => ({
  ...current,
  [name]: value,
}));

}

async function handleSave() {
try {
setSaving(true);

  // Temporary mock save.
  // This will be replaced with the real API/database later.
  await new Promise((resolve) =>
    setTimeout(resolve, 700)
  );

  toast.success(
    "System settings saved successfully."
  );
} catch (error) {
  console.error(
    "Save system settings error:",
    error
  );

  toast.error(
    "Unable to save system settings."
  );
} finally {
  setSaving(false);
}

}


return ( <main className="min-h-screen bg-[var(--cream)] px-5 py-8 transition-colors md:px-8"> <div className="mx-auto w-full max-w-7xl">

    {/* Top */}
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

      {/* Header */}
      <div>
            <Link
                href="/superadmin"
                className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#d41367]"
            >
                <ArrowLeft size={16} />
                Super Admin
            </Link>

            <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d41367] text-white">
                    <ShieldCheck size={22} />
                </div>

                <div>
                    <p className="text-sm font-medium text-[#d41367]">
                        Administration
                    </p>

                    <h1 className="text-2xl font-semibold text-[var(--dark)]">
                      System Settings
                    </h1>
                </div>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-gray-500">
              Manage general information and system-wide
              settings for Rotaract Lagos Prime.
            </p>
        </div>
    </div>



































    {/* Settings */}
    <div className="space-y-6">

      {/* General */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-base font-semibold text-gray-900">
            General
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Basic information about the club.
          </p>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">

          {/* Club Name */}
          <div>
            <label
              htmlFor="clubName"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Club Name
            </label>

            <input
              id="clubName"
              name="clubName"
              type="text"
              value={settings.clubName}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#d41367] focus:ring-2 focus:ring-[#d41367]/10"
            />
          </div>

          {/* Club Email */}
          <div>
            <label
              htmlFor="clubEmail"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Club Email
            </label>

            <input
              id="clubEmail"
              name="clubEmail"
              type="email"
              value={settings.clubEmail}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#d41367] focus:ring-2 focus:ring-[#d41367]/10"
            />
          </div>

          {/* Club Phone */}
          <div>
            <label
              htmlFor="clubPhone"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Club Phone
            </label>

            <input
              id="clubPhone"
              name="clubPhone"
              type="tel"
              value={settings.clubPhone}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#d41367] focus:ring-2 focus:ring-[#d41367]/10"
            />
          </div>

          {/* Club Address */}
          <div>
            <label
              htmlFor="clubAddress"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Club Address
            </label>

            <input
              id="clubAddress"
              name="clubAddress"
              type="text"
              value={settings.clubAddress}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#d41367] focus:ring-2 focus:ring-[#d41367]/10"
            />
          </div>
        </div>
      </section>

      {/* Rotary Year */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-base font-semibold text-gray-900">
            Current Rotary Year
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Define the current operating year for the
            club.
          </p>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-3">

          {/* Rotary Year */}
          <div>
            <label
              htmlFor="rotaryYear"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Rotary Year
            </label>

            <input
              id="rotaryYear"
              name="rotaryYear"
              type="text"
              value={settings.rotaryYear}
              onChange={handleChange}
              placeholder="2026–2027"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#d41367] focus:ring-2 focus:ring-[#d41367]/10"
            />
          </div>

          {/* Start Date */}
          <div>
            <label
              htmlFor="startDate"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Start Date
            </label>

            <input
              id="startDate"
              name="startDate"
              type="date"
              value={settings.startDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#d41367] focus:ring-2 focus:ring-[#d41367]/10"
            />
          </div>

          {/* End Date */}
          <div>
            <label
              htmlFor="endDate"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              End Date
            </label>

            <input
              id="endDate"
              name="endDate"
              type="date"
              value={settings.endDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#d41367] focus:ring-2 focus:ring-[#d41367]/10"
            />
          </div>
        </div>
      </section>

      {/* Save */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#d41367] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b91059] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Save size={17} />
          )}

          {saving
            ? "Saving Changes..."
            : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
</main>

);
}
