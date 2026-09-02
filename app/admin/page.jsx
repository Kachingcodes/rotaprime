"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">

      {/* ================================
          Header
      ================================= */}
      <div>
        <p className="text-sm font-medium text-rotaract">
          OVERVIEW
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Welcome back. Here's an overview of Rotaract Lagos Prime.
        </p>
      </div>


      {/* ================================
          Statistics
      ================================= */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Members */}
        <Link
          href="/admin/members"
          className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Members
              </p>

              <p className="mt-3 text-3xl font-bold text-gray-900">
                0
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rotaract/10 text-rotaract">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M16 21V19C16 16.7909 14.2091 15 12 15H6C3.79086 15 2 16.7909 2 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <circle
                  cx="9"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M19 8V14M22 11H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

          </div>

          <p className="mt-5 text-xs font-medium text-gray-400 group-hover:text-rotaract">
            View members →
          </p>
        </Link>


        {/* New Members */}
        <Link
          href="/admin/members"
          className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                New Members
              </p>

              <p className="mt-3 text-3xl font-bold text-gray-900">
                0
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M16 21V19C16 16.7909 14.2091 15 12 15H6C3.79086 15 2 16.7909 2 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <circle
                  cx="9"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M19 8V14M22 11H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

          </div>

          <p className="mt-5 text-xs font-medium text-gray-400">
            This month
          </p>
        </Link>


        {/* Messages */}
        <Link
          href="/admin/messages"
          className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Messages
              </p>

              <p className="mt-3 text-3xl font-bold text-gray-900">
                0
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M21 11.5C21 16.1944 16.9706 20 12 20C10.4415 20 8.98291 19.6334 7.70647 18.9907L3 20L4.29984 16.1994C3.47747 14.8782 3 13.3306 3 11.5C3 6.80558 7.02944 3 12 3C16.9706 3 21 6.80558 21 11.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

          </div>

          <p className="mt-5 text-xs font-medium text-gray-400">
            View messages →
          </p>
        </Link>


        {/* Pending */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending
              </p>

              <p className="mt-3 text-3xl font-bold text-gray-900">
                0
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M12 7V12L15 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

          </div>

          <p className="mt-5 text-xs font-medium text-gray-400">
            Requires attention
          </p>
        </div>

      </div>


      {/* ================================
          Quick Actions
      ================================= */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Members */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Members
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your Rotaract members.
              </p>
            </div>

            <Link
              href="/admin/members"
              className="text-sm font-semibold text-rotaract hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-500">
              No member data to display yet.
            </p>

            <Link
              href="/admin/members"
              className="mt-4 inline-block rounded-full bg-rotaract px-5 py-2.5 text-xs font-bold text-white transition hover:bg-rotaract-dark"
            >
              VIEW MEMBERS
            </Link>
          </div>

        </div>


        {/* Messages */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Messages
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Messages submitted through your website.
              </p>
            </div>

            <Link
              href="/admin/messages"
              className="text-sm font-semibold text-rotaract hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-500">
              No messages to display yet.
            </p>

            <Link
              href="/admin/messages"
              className="mt-4 inline-block rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-100"
            >
              VIEW MESSAGES
            </Link>
          </div>

        </div>

      </div>


      {/* ================================
          Welcome / Information
      ================================= */}
      <div className="rounded-2xl bg-hero p-6 text-white shadow-sm sm:p-8">

        <div className="max-w-2xl">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rotaract">
            Rotaract Lagos Prime
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Creating change. Inspiring leaders.
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/60">
            This dashboard will give you a central place to manage your
            members, respond to messages, and configure your website.
          </p>

        </div>

      </div>

    </div>
  );
}