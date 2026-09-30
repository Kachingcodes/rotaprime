"use client";

import { useState } from "react";
import {
CalendarDays,
HeartHandshake,
Bell,
UserRound,
KeyRound,
X,
Eye,
EyeOff,
} from "lucide-react";
import { toast } from "react-toastify";

export default function WelfareHeader({
notifications = [],
onMarkAsRead,
onMarkAllAsRead,
user = null,
}) {
const [showNotifications, setShowNotifications] =
useState(false);

const [showUserMenu, setShowUserMenu] =
useState(false);

const [showPasswordModal, setShowPasswordModal] =
useState(false);

const [currentPassword, setCurrentPassword] =
useState("");

const [newPassword, setNewPassword] =
useState("");

const [confirmPassword, setConfirmPassword] =
useState("");

const [showCurrentPassword, setShowCurrentPassword] =
useState(false);

const [showNewPassword, setShowNewPassword] =
useState(false);

const [showConfirmPassword, setShowConfirmPassword] =
useState(false);

const [changingPassword, setChangingPassword] =
useState(false);

const today = new Intl.DateTimeFormat("en-NG", {
weekday: "short",
day: "numeric",
month: "short",
year: "2-digit",
}).format(new Date());

const unreadNotificationCount = notifications.filter(
(notification) => !notification.isRead
).length;

const openPasswordModal = () => {
setShowUserMenu(false);
setShowPasswordModal(true);
};

const closePasswordModal = () => {
if (changingPassword) return;


setShowPasswordModal(false);

setCurrentPassword("");
setNewPassword("");
setConfirmPassword("");

setShowCurrentPassword(false);
setShowNewPassword(false);
setShowConfirmPassword(false);


};

const handleChangePassword = async (event) => {
event.preventDefault();


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
  setChangingPassword(true);

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
    toast.error(
      data.error || "Unable to change password."
    );
    return;
  }

  toast.success("Password changed successfully.");

  closePasswordModal();
} catch (error) {
  console.error("Change password error:", error);

  toast.error(
    "Something went wrong while changing your password."
  );
} finally {
  setChangingPassword(false);
}

};

const initials = user?.name
? user.name
.split(" ")
.filter(Boolean)
.map((name) => name.charAt(0))
.join("")
.slice(0, 2)
.toUpperCase()
: "";

return (
<> <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

    {/* Title */}
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rotaract/10 text-rotaract">
        <HeartHandshake
          size={23}
          strokeWidth={2}
        />
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Welfare
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage member attendance and
        </p>

        <p className="mt-1 text-sm text-gray-500">
          view member profiles.
        </p>
        
      </div>
    </div>

    {/* Right side */}
    <div className="flex items-center gap-3">

      {/* Logged-in User */}
      {user && (
        <div className="relative">

          {/* User Profile Button */}
          <button
            type="button"
            onClick={() =>
              setShowUserMenu(
                (current) => !current
              )
            }
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-left transition hover:bg-gray-50"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rotaract/10 text-xs font-bold text-rotaract">
              {initials || (
                <UserRound size={15} />
              )}
            </div>

            <div className="hidden min-w-0 sm:block">
              <p className="max-w-[140px] truncate text-xs font-semibold text-gray-900">
                {user.name}
              </p>

              <p className="max-w-[140px] truncate text-[10px] text-gray-400">
                {user.position ||
                  user.accountType ||
                  "User"}
              </p>
            </div>
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-12 z-[100] w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">

              {/* Account Info */}
              <div className="border-b border-gray-100 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rotaract/10 text-sm font-bold text-rotaract">
                    {initials || (
                      <UserRound size={18} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                {user.position && (
                  <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Position
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-gray-700">
                      {user.position}
                    </p>
                  </div>
                )}

                {user.lastLogin && (
                  <p className="mt-3 text-[11px] text-gray-400">
                    Last login:{" "}
                    {new Date(
                      user.lastLogin
                    ).toLocaleString("en-NG")}
                  </p>
                )}
              </div>

              {/* Change Password */}
              <button
                type="button"
                onClick={openPasswordModal}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <KeyRound
                  size={16}
                  className="text-gray-400"
                />

                Change Password
              </button>
            </div>
          )}
        </div>
      )}

      {/* Notification Bell */}
      <div className="relative">
        <button
          type="button"
          onClick={() =>
            setShowNotifications(
              (current) => !current
            )
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
                        onMarkAsRead(
                          notification.id
                        )
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
        <CalendarDays
          size={17}
          className="text-gray-400"
        />

        <span>{today}</span>
      </div>
    </div>
  </div>

  {/* Change Password Modal */}
  {showPasswordModal && (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closePasswordModal();
        }
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Change Password
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Update your account password.
            </p>
          </div>

          <button
            type="button"
            onClick={closePasswordModal}
            disabled={changingPassword}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleChangePassword}
          className="space-y-5 px-6 py-6"
        >

          {/* Current Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
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
                onChange={(event) =>
                  setCurrentPassword(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-11 text-sm text-gray-900 outline-none transition focus:border-rotaract focus:ring-1 focus:ring-rotaract"
                placeholder="Enter current password"
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(
                    (value) => !value
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                aria-label={
                  showCurrentPassword
                    ? "Hide password"
                    : "Show password"
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
            <label className="mb-2 block text-sm font-medium text-gray-700">
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
                onChange={(event) =>
                  setNewPassword(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-11 text-sm text-gray-900 outline-none transition focus:border-rotaract focus:ring-1 focus:ring-rotaract"
                placeholder="Enter new password"
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowNewPassword(
                    (value) => !value
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                aria-label={
                  showNewPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showNewPassword ? (
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
                  setConfirmPassword(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-11 text-sm text-gray-900 outline-none transition focus:border-rotaract focus:ring-1 focus:ring-rotaract"
                placeholder="Confirm new password"
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (value) => !value
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
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
            Your new password must be at least 8
            characters.
          </p>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={closePasswordModal}
              disabled={changingPassword}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={changingPassword}
              className="flex-1 rounded-xl bg-rotaract px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {changingPassword
                ? "Changing..."
                : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</>

);
}
