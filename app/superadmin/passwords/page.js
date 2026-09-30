"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  KeyRound,
  UserRound,
  ShieldCheck,
  CircleCheck,
  CircleX,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "react-toastify";

export default function PasswordManagementPage() {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedAccount, setSelectedAccount] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadAccounts() {
      try {
        setLoading(true);

        const response = await fetch("/api/superadmin/accounts");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load accounts."
          );
        }

        setAccounts(data.accounts || []);
      } catch (error) {
        console.error("Load password accounts error:", error);

        toast.error(
          error.message || "Unable to load accounts."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAccounts();
  }, []);

  const filteredAccounts = accounts.filter((account) => {
    const searchValue = search.toLowerCase();

    return (
      account.name.toLowerCase().includes(searchValue) ||
      account.email.toLowerCase().includes(searchValue)
    );
  });

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!selectedAccount) {
      toast.error("Please select an account.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error("Please enter and confirm the new password.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        "/api/superadmin/passwords",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountId: selectedAccount.id,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.error || "Unable to reset password."
        );
        return;
      }

      toast.success("Password reset successfully.");

      setNewPassword("");
      setConfirmPassword("");
      setSelectedAccount(null);
    } catch (error) {
      console.error("Reset password error:", error);

      toast.error(
        "Something went wrong while resetting the password."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--cream)] px-5 py-8 transition-colors md:px-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/superadmin"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#d41367]"
          >
            <ArrowLeft size={16} />
            Super Admin
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fce1ec] text-[#d41367]">
              <KeyRound size={21} />
            </div>

            <div>
              <p className="text-sm font-medium text-[#d41367]">
                Administration
              </p>

              <h1 className="text-2xl font-semibold text-[var(--dark)]">
                Password Management
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Reset passwords for user accounts when assistance is
            required.
          </p>
        </div>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">

          {/* Accounts */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

            <div className="border-b border-gray-100 p-5">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search by name or email..."
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#d41367] focus:ring-1 focus:ring-[#d41367]"
                />
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="px-6 py-12 text-center text-sm text-gray-500">
                  Loading accounts...
                </div>
              ) : filteredAccounts.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-gray-500">
                  No accounts found.
                </div>
              ) : (
                filteredAccounts.map((account) => {
                  const isSelected =
                    selectedAccount?.id === account.id;

                  return (
                    <button
                      key={account.id}
                      type="button"
                      onClick={() =>
                        setSelectedAccount(account)
                      }
                      className={`flex w-full items-center justify-between px-5 py-4 text-left transition ${
                        isSelected
                          ? "bg-[#fce1ec]"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            account.accountType === "Super Admin"
                              ? "bg-[#fce1ec] text-[#d41367]"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {account.accountType ===
                          "Super Admin" ? (
                            <ShieldCheck size={18} />
                          ) : (
                            <UserRound size={18} />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {account.name}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            {account.email}
                          </p>

                          {account.accountType ===
                          "Super Admin" ? (
                            <p className="mt-1 text-xs text-[#d41367]">
                              Super Admin
                            </p>
                          ) : (
                            <p className="mt-1 text-xs text-gray-500">
                              {account.position || "Member"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        {account.status === "Active" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                            <CircleCheck size={13} />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                            <CircleX size={13} />
                            Inactive
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          {/* Reset Form */}
          <section className="h-fit rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fce1ec] text-[#d41367]">
                <KeyRound size={19} />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                Reset Password
              </h2>

              <p className="mt-1 text-sm leading-5 text-gray-500">
                Set a new password for the selected account.
              </p>
            </div>

            {selectedAccount ? (
              <form
                onSubmit={handleResetPassword}
                className="space-y-5"
              >
                {/* Selected account */}
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Selected Account
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedAccount.name}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {selectedAccount.email}
                  </p>
                </div>

                {/* New Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showPassword ? "text" : "password"
                      }
                      value={newPassword}
                      onChange={(event) =>
                        setNewPassword(event.target.value)
                      }
                      placeholder="Enter new password"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-11 text-sm text-gray-900 outline-none transition focus:border-[#d41367] focus:ring-1 focus:ring-[#d41367]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
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
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Confirm new password"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-11 text-sm text-gray-900 outline-none transition focus:border-[#d41367] focus:ring-1 focus:ring-[#d41367]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (value) => !value
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
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

                <p className="text-xs leading-5 text-gray-500">
                  The new password must be at least 8
                  characters.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-[#d41367] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#b91059] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Resetting Password..."
                    : "Reset Password"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedAccount(null);
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 px-5 py-10 text-center">
                <KeyRound
                  size={24}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-3 text-sm font-medium text-gray-700">
                  Select an account
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Choose an account from the list to reset its
                  password.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
