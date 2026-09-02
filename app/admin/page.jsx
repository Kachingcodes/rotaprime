"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Clock3,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Bell,
  ArrowRight,
  Mail,
  UserCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function AdminDashboard() {
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  // ========================================
  // Load dashboard data
  // ========================================

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [membersResponse, messagesResponse] =
        await Promise.all([
          fetch("/api/admin/members"),
          fetch("/api/admin/messages"),
        ]);

      const membersData =
        await membersResponse.json();

      const messagesData =
        await messagesResponse.json();

      if (!membersResponse.ok) {
        throw new Error(
          membersData.message ||
            "Unable to load members."
        );
      }

      if (!messagesResponse.ok) {
        throw new Error(
          messagesData.message ||
            "Unable to load messages."
        );
      }

      setMembers(membersData.members || []);
      setMessages(messagesData.messages || []);
    } catch (error) {
      console.error(
        "DASHBOARD LOAD ERROR:",
        error
      );

      setError(
        error.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // Statistics
  // ========================================

  const totalMembers = members.length;

  const acceptedMembers = members.filter(
    (member) =>
      member.status === "accepted"
  ).length;

  const pendingMembers = members.filter(
    (member) =>
      member.status === "pending"
  ).length;

  const rejectedMembers = members.filter(
    (member) =>
      member.status === "rejected"
  ).length;

  const totalMessages = messages.length;

  const unreadMessages = messages.filter(
    (message) =>
      message.status === "unread"
  ).length;

  const readMessages = messages.filter(
    (message) =>
      message.status === "read"
  ).length;

  const repliedMessages = messages.filter(
    (message) =>
      message.status === "replied"
  ).length;

  // ========================================
  // Recent data
  // ========================================

  const recentMembers = [...members]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const recentMessages = [...messages]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  // ========================================
  // Notifications
  // ========================================

  const notifications = [];

  if (pendingMembers > 0) {
    notifications.push({
      id: "pending-members",
      type: "member",
      icon: <UserPlus size={18} />,
      title: `${pendingMembers} pending membership ${
        pendingMembers === 1
          ? "application"
          : "applications"
      }`,
      description:
        "Membership applications are waiting for your review.",
      href: "/admin/members",
      action: "Review applications",
    });
  }

  if (unreadMessages > 0) {
    notifications.push({
      id: "unread-messages",
      type: "message",
      icon: <Mail size={18} />,
      title: `${unreadMessages} unread ${
        unreadMessages === 1
          ? "message"
          : "messages"
      }`,
      description:
        "Someone has contacted Rotaract Lagos Prime.",
      href: "/admin/messages",
      action: "View messages",
    });
  }

  if (notifications.length === 0) {
    notifications.push({
      id: "all-clear",
      type: "success",
      icon: <CheckCircle2 size={18} />,
      title: "You're all caught up",
      description:
        "There are no pending applications or unread messages.",
      href: null,
      action: null,
    });
  }

  // ========================================
  // Date formatter
  // ========================================

  function formatDate(date) {
    if (!date) return "Unknown date";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Unknown date";
    }

    return parsed.toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  // ========================================
  // Loading
  // ========================================

  if (loading) {
    return (
      <main className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2
            size={20}
            className="animate-spin"
          />

          Loading dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-8">

      {/* ========================================
          Header + Notification Bell
      ======================================== */}

      <div className="flex items-start justify-between gap-6">

        {/* Header text */}
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-rotaract">
            Overview
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Welcome back. Here's what's happening with
            Rotaract Lagos Prime.
          </p>
        </div>


        {/* Notification bell */}
        <div className="relative shrink-0">

          <button
            type="button"
            onClick={() =>
              setShowNotifications((current) => !current)
            }
            className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition ${
              showNotifications
                ? "border-rotaract bg-rotaract/10 text-rotaract"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
            aria-label="Notifications"
          >

            <Bell size={21} />

            {/* Notification count */}
            {pendingMembers + unreadMessages > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {pendingMembers + unreadMessages > 9
                  ? "9+"
                  : pendingMembers + unreadMessages}
              </span>
            )}

          </button>


          {/* ========================================
              Notification Dropdown
          ======================================== */}

          {showNotifications && (
            <div className="absolute right-0 top-14 z-50 w-[calc(100vw-2rem)] max-w-[340px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
              {/* Dropdown header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

                <div>
                  <h3 className="font-bold text-gray-900">
                    Notifications
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Things that need your attention
                  </p>
                </div>

                {pendingMembers + unreadMessages > 0 && (
                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase text-red-600">
                    {pendingMembers + unreadMessages} new
                  </span>
                )}

              </div>


              {/* Notifications */}
              <div className="max-h-[360px] overflow-y-auto">

                {notifications.map((notification) => {

                  const content = (
                    <div
                      className="flex items-start gap-3 px-5 py-4 transition hover:bg-gray-50"
                      onClick={() =>
                        setShowNotifications(false)
                      }
                    >

                      {/* Icon */}
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          notification.type === "member"
                            ? "bg-yellow-50 text-yellow-600"
                            : notification.type === "message"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {notification.icon}
                      </div>


                      {/* Content */}
                      <div className="min-w-0 flex-1">

                        <p className="text-sm font-semibold text-gray-900">
                          {notification.title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          {notification.description}
                        </p>

                        {notification.action && (
                          <p className="mt-2 text-xs font-bold text-rotaract">
                            {notification.action} →
                          </p>
                        )}

                      </div>

                    </div>
                  );

                  return notification.href ? (
                    <Link
                      key={notification.id}
                      href={notification.href}
                      onClick={() =>
                        setShowNotifications(false)
                      }
                    >
                      {content}
                    </Link>
                  ) : (
                    <div key={notification.id}>
                      {content}
                    </div>
                  );
                })}

              </div>


              {/* Footer */}
              {(pendingMembers > 0 || unreadMessages > 0) && (
                <div className="border-t border-gray-100 px-5 py-3">

                  <Link
                    href="/admin/members"
                    onClick={() =>
                      setShowNotifications(false)
                    }
                    className="block text-center text-xs font-bold text-rotaract hover:underline"
                  >
                    Review pending applications
                  </Link>

                </div>
              )}

            </div>
          )}

        </div>

      </div>


      {/* ========================================
          Error
      ======================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              Unable to load some dashboard data
            </p>

            <p className="mt-1">
              {error}
            </p>
          </div>
        </div>
      )}


      {/* ========================================
          Statistics
      ======================================== */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total Members */}

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
                {totalMembers}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                {acceptedMembers} accepted
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rotaract/10 text-rotaract">
              <Users size={22} />
            </div>

          </div>

          <p className="mt-5 text-xs font-bold text-gray-400 transition group-hover:text-rotaract">
            View members →
          </p>
        </Link>


        {/* Pending */}

        <Link
          href="/admin/members"
          className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Applications
              </p>

              <p className="mt-3 text-3xl font-bold text-gray-900">
                {pendingMembers}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Requires attention
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
              <Clock3 size={22} />
            </div>

          </div>

          <p className="mt-5 text-xs font-bold text-gray-400 transition group-hover:text-yellow-600">
            Review applications →
          </p>
        </Link>


        {/* Unread Messages */}

        <Link
          href="/admin/messages"
          className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Unread Messages
              </p>

              <p className="mt-3 text-3xl font-bold text-gray-900">
                {unreadMessages}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                {totalMessages} total messages
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MessageSquare size={22} />
            </div>

          </div>

          <p className="mt-5 text-xs font-bold text-gray-400 transition group-hover:text-blue-600">
            View messages →
          </p>
        </Link>


        {/* Replied */}

        <Link
          href="/admin/messages"
          className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Replied Messages
              </p>

              <p className="mt-3 text-3xl font-bold text-gray-900">
                {repliedMessages}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                {readMessages} read
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 size={22} />
            </div>

          </div>

          <p className="mt-5 text-xs font-bold text-gray-400 transition group-hover:text-green-600">
            Manage messages →
          </p>
        </Link>

      </div>

      {/* ========================================
          Recent Activity
      ======================================== */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* ======================================
            Recent Members
        ====================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5 sm:px-6">

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Members
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest membership activity.
              </p>
            </div>

            <Link
              href="/admin/members"
              className="text-sm font-bold text-rotaract hover:underline"
            >
              View all
            </Link>

          </div>


          <div className="divide-y divide-gray-100">

            {recentMembers.length === 0 ? (

              <div className="px-6 py-12 text-center">
                <Users
                  size={28}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-3 text-sm text-gray-500">
                  No members yet.
                </p>
              </div>

            ) : (

              recentMembers.map((member) => (

                <div
                  key={member.id}
                  className="flex items-center gap-3 px-5 py-4 sm:px-6"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rotaract/10 text-sm font-bold text-rotaract">
                    {(member.firstname?.[0] || "").toUpperCase()}
                    {(member.lastname?.[0] || "").toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-semibold text-gray-900">
                      {member.firstname}{" "}
                      {member.lastname}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      {formatDate(member.createdAt)}
                    </p>

                  </div>

                  <MemberStatus
                    status={member.status}
                  />

                </div>

              ))

            )}

          </div>

        </section>


        {/* ======================================
            Recent Messages
        ====================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5 sm:px-6">

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Messages
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest messages from your website.
              </p>
            </div>

            <Link
              href="/admin/messages"
              className="text-sm font-bold text-rotaract hover:underline"
            >
              View all
            </Link>

          </div>


          <div className="divide-y divide-gray-100">

            {recentMessages.length === 0 ? (

              <div className="px-6 py-12 text-center">
                <MessageSquare
                  size={28}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-3 text-sm text-gray-500">
                  No messages yet.
                </p>
              </div>

            ) : (

              recentMessages.map((message) => (

                <Link
                  key={message.id}
                  href="/admin/messages"
                  className="flex items-start gap-3 px-5 py-4 transition hover:bg-gray-50 sm:px-6"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Mail size={17} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center justify-between gap-3">

                      <p className="truncate text-sm font-semibold text-gray-900">
                        {message.name || "Unknown"}
                      </p>

                      <MessageStatus
                        status={message.status}
                      />

                    </div>

                    <p className="mt-1 truncate text-sm text-gray-500">
                      {message.message || "No message"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(message.createdAt)}
                    </p>

                  </div>

                </Link>

              ))

            )}

          </div>

        </section>

      </div>


      {/* ========================================
          Membership Summary
      ======================================== */}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-bold text-gray-900">
              Membership Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current membership status across your club.
            </p>

          </div>

          <Link
            href="/admin/members"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-rotaract px-5 py-2.5 text-xs font-bold text-white transition hover:bg-rotaract-dark"
          >
            MANAGE MEMBERS
            <ArrowRight size={15} />
          </Link>

        </div>


        <div className="mt-6 grid gap-4 sm:grid-cols-3">

          {/* Accepted */}

          <div className="rounded-xl bg-green-50 p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <UserCheck size={18} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-green-600">
                  Accepted
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {acceptedMembers}
                </p>
              </div>

            </div>

          </div>


          {/* Pending */}

          <div className="rounded-xl bg-yellow-50 p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                <Clock3 size={18} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-yellow-600">
                  Pending
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {pendingMembers}
                </p>
              </div>

            </div>

          </div>


          {/* Rejected */}

          <div className="rounded-xl bg-red-50 p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600">
                <XCircle size={18} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                  Rejected
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {rejectedMembers}
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          Welcome
      ======================================== */}

      <div className="rounded-2xl bg-hero p-6 text-white shadow-sm sm:p-8">

        <div className="max-w-2xl">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rotaract">
            Rotaract Lagos Prime
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Creating change. Inspiring leaders.
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/60">
            Your administration dashboard brings
            membership applications, members, messages,
            and club administration together in one place.
          </p>

        </div>

      </div>

    </main>
  );
}


/* ========================================
   Member Status
======================================== */

function MemberStatus({ status }) {
  const styles = {
    accepted:
      "bg-green-50 text-green-600",
    pending:
      "bg-yellow-50 text-yellow-600",
    rejected:
      "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
        styles[status] ||
        "bg-gray-100 text-gray-500"
      }`}
    >
      {status || "unknown"}
    </span>
  );
}


/* ========================================
   Message Status
======================================== */

function MessageStatus({ status }) {
  const styles = {
    unread:
      "bg-blue-50 text-blue-600",
    read:
      "bg-gray-100 text-gray-500",
    replied:
      "bg-green-50 text-green-600",
  };

  return (
    <span
      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
        styles[status] ||
        "bg-gray-100 text-gray-500"
      }`}
    >
      {status || "unread"}
    </span>
  );
}