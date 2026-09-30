"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Plus,
  MoreHorizontal,
  ShieldCheck,
  UserRound,
  Clock3,
  CircleCheck,
  CircleX,
} from "lucide-react";

import AddAccountModal from "./AddAccountModal";



export default function UserAccountsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);


  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(search.toLowerCase()) ||
      account.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || account.status === statusFilter;

    return matchesSearch && matchesStatus;
  });


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
        console.error("Load accounts error:", error);
        } finally {
        setLoading(false);
        }
    }

    loadAccounts();
    }, []);

  return (
    <main className="min-h-screen bg-[var(--cream)] px-5 py-8 transition-colors md:px-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/superadmin"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#d41367]"
            >
              <ArrowLeft size={16} />
              Super Admin
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fce1ec] text-[#d41367]">
                <ShieldCheck size={21} />
              </div>

              <div>
                <p className="text-sm font-medium text-[#d41367]">
                  Administration
                </p>

                <h1 className="text-2xl font-semibold text-[var(--dark)]">
                  User Accounts
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              Onboard users, manage account status, and control who can access
              the system.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddAccount(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d41367] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#b91059]"
          >
            <Plus size={17} />
            Add Account
          </button>
        </div>

        {/* Toolbar */}
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#d41367] focus:ring-1 focus:ring-[#d41367]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#d41367] focus:ring-1 focus:ring-[#d41367]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Accounts Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Account
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Account Type
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Last Login
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

                <tbody>
              {loading ? (
                <tr>
                    <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-sm text-gray-500"
                    >
                        Loading accounts...
                    </td>
                </tr>
              ) : filteredAccounts.length > 0 ? (
                  filteredAccounts.map((account) => (
                    <tr
                      key={account.id}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      {/* Account */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fce1ec] text-[#d41367]">
                            <UserRound size={18} />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {account.name}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500">
                              {account.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Account Type */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 text-sm text-gray-700">
                          {account.accountType === "Super Admin" ? (
                            <>
                                <ShieldCheck
                                size={16}
                                className="text-[#d41367]"
                                />
                                Super Admin
                            </>
                          ) : (
                            <>
                                <UserRound
                                    size={16}
                                    className="text-gray-400"
                                />
                                {account.position || "Member"}
                            </>
                          )}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {account.status === "Active" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                            <CircleCheck size={14} />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                            <CircleX size={14} />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Last Login */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                          <Clock3 size={15} />
                          {account.lastLogin
                            ? new Date(account.lastLogin).toLocaleString()
                            : "Never" }
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                          aria-label={`Actions for ${account.name}`}
                        >
                          <MoreHorizontal size={19} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-sm text-gray-500"
                    >
                      No accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Count */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {filteredAccounts.length} of {accounts.length}{" "}
            accounts
          </span>
        </div>
      </div>

      {showAddAccount && (
        <AddAccountModal
            onClose={() => setShowAddAccount(false)}
        />
      )}
    </main>
  );
}
