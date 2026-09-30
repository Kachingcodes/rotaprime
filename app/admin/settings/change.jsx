"use client";

import { useState } from "react";
import {
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

export default function Change() {
  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error(
        "Your new password must be different from your current password."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "/api/account/password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to change password."
        );
      }

      toast.success(
        "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Unable to change password."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rotaract/10 text-rotaract">
            <KeyRound size={20} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">
              Change Password
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update the password for your administrator account.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 p-5 sm:p-6"
      >
        {/* Current Password */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Current Password
          </label>

          <div className="relative">
            <input
              type={
                showCurrentPassword
                  ? "text"
                  : "password"
              }
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
              disabled={saving}
              autoComplete="current-password"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rotaract focus:ring-2 focus:ring-rotaract/10 disabled:opacity-60"
              placeholder="Enter your current password"
            />

            <button
              type="button"
              onClick={() =>
                setShowCurrentPassword(
                  (current) => !current
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 transition hover:text-gray-700"
              aria-label={
                showCurrentPassword
                  ? "Hide current password"
                  : "Show current password"
              }
            >
              {showCurrentPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            New Password
          </label>

          <div className="relative">
            <input
              type={
                showNewPassword
                  ? "text"
                  : "password"
              }
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              disabled={saving}
              autoComplete="new-password"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rotaract focus:ring-2 focus:ring-rotaract/10 disabled:opacity-60"
              placeholder="Enter your new password"
            />

            <button
              type="button"
              onClick={() =>
                setShowNewPassword(
                  (current) => !current
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 transition hover:text-gray-700"
              aria-label={
                showNewPassword
                  ? "Hide new password"
                  : "Show new password"
              }
            >
              {showNewPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Password must be at least 8 characters.
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Confirm New Password
          </label>

          <div className="relative">
            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              disabled={saving}
              autoComplete="new-password"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rotaract focus:ring-2 focus:ring-rotaract/10 disabled:opacity-60"
              placeholder="Confirm your new password"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (current) => !current
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 transition hover:text-gray-700"
              aria-label={
                showConfirmPassword
                  ? "Hide password confirmation"
                  : "Show password confirmation"
              }
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-rotaract px-4 py-3 text-sm font-semibold text-white transition hover:bg-rotaract-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving && (
              <Loader2
                size={17}
                className="animate-spin"
              />
            )}

            {saving
              ? "CHANGING PASSWORD..."
              : "CHANGE PASSWORD"}
          </button>
        </div>
      </form>
    </section>
  );
}
