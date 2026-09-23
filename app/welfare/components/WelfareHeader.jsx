"use client";

import { useState } from "react";
import {
  CalendarDays,
  HeartHandshake,
  Bell,
} from "lucide-react";

export default function WelfareHeader({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const today = new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const unreadNotificationCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Title */}
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rotaract/10 text-rotaract">
          <HeartHandshake size={23} strokeWidth={2} />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Welfare
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage member attendance and view member profiles.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setShowNotifications((current) => !current)
            }
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            aria-label="Notifications"
          >
            <Bell size={18} strokeWidth={2} />

            {unreadNotificationCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {unreadNotificationCount > 9
                  ? "9+"
                  : unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 z-[100] w-[350px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Notifications
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Attendance alerts
                  </p>
                </div>

                {unreadNotificationCount > 0 && (
                  <button
                    type="button"
                    onClick={onMarkAllAsRead}
                    className="text-xs font-medium text-rotaract hover:opacity-80"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications */}
              <div className="max-h-[350px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <Bell
                      size={22}
                      className="mx-auto mb-2 text-gray-300"
                    />

                    <p className="text-sm font-medium text-gray-700">
                      No notifications
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Attendance alerts will appear here.
                    </p>
                  </div>
                ) : (
                  notifications
                    .slice()
                    .reverse()
                    .map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() =>
                          onMarkAsRead(notification.id)
                        }
                        className={`flex w-full gap-3 border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 ${
                          !notification.isRead
                            ? "bg-red-50/40"
                            : "bg-white"
                        }`}
                      >
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                          <Bell size={15} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-gray-900">
                              Attendance Alert
                            </p>

                            {!notification.isRead && (
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                            )}
                          </div>

                          <p className="mt-1 text-xs leading-5 text-gray-600">
                            {notification.message}
                          </p>

                          <p className="mt-1.5 text-[11px] text-gray-400">
                            {notification.attendanceDate}
                          </p>
                        </div>
                      </button>
                    ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Date */}
        <div className="flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
          <CalendarDays size={17} className="text-gray-400" />
          <span>{today}</span>
        </div>
      </div>
    </div>
  );
}