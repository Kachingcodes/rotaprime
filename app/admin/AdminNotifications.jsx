"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bell,
  MessageSquare,
  UserPlus,
  CheckCircle,
  XCircle,
  ChevronRight,
} from "lucide-react";

export default function AdminNotifications({
  unreadMessages = 0,
  pendingMembers = 0,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const notifications = [];

  // Unread messages
  if (unreadMessages > 0) {
    notifications.push({
      id: "messages",
      type: "message",
      title: "New messages",
      description: `${unreadMessages} unread ${
        unreadMessages === 1 ? "message" : "messages"
      }`,
      href: "/admin/messages",
      icon: MessageSquare,
      iconClass: "bg-blue-50 text-blue-600",
    });
  }

  // Pending members
  if (pendingMembers > 0) {
    notifications.push({
      id: "members",
      type: "member",
      title: "Pending members",
      description: `${pendingMembers} ${
        pendingMembers === 1 ? "application" : "applications"
      } waiting for review`,
      href: "/admin/members",
      icon: UserPlus,
      iconClass: "bg-yellow-50 text-yellow-600",
    });
  }

  const notificationCount = notifications.length;

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      {/* Bell button */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition ${
          open
            ? "border-rotaract bg-rotaract/10 text-rotaract"
            : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
        }`}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell size={19} />

        {/* Notification badge */}
        {notificationCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {notificationCount > 9
              ? "9+"
              : notificationCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 z-[100] w-[350px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

            <div>
              <h3 className="font-bold text-gray-900">
                Notifications
              </h3>

              <p className="mt-0.5 text-xs text-gray-500">
                Things that need your attention
              </p>
            </div>

            {notificationCount > 0 && (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                {notificationCount}{" "}
                {notificationCount === 1
                  ? "item"
                  : "items"}
              </span>
            )}

          </div>

          {/* Notifications */}
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">

              {notifications.map((notification) => {
                const Icon = notification.icon;

                return (
                  <Link
                    key={notification.id}
                    href={notification.href}
                    onClick={() => setOpen(false)}
                    className="flex gap-3 px-5 py-4 transition hover:bg-gray-50"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${notification.iconClass}`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {notification.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {notification.description}
                      </p>
                    </div>

                    <ChevronRight
                      size={17}
                      className="mt-2 shrink-0 text-gray-300"
                    />
                  </Link>
                );
              })}

            </div>
          ) : (
            /* Empty */
            <div className="px-6 py-10 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <Bell size={21} />
              </div>

              <p className="mt-3 text-sm font-semibold text-gray-900">
                You're all caught up
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                There are no new notifications right now.
              </p>

            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
            <Link
              href="/admin/messages"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-rotaract hover:underline"
            >
              View messages →
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}