"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  CalendarDays,
  User,
  Check,
  UserX,
  CircleCheck,
  Clock3,
} from "lucide-react";

export default function WelfareMemberDrawer({
  member,
  onClose,
  onAttendanceChange,
  selectedDate,
}) {
  const [mounted, setMounted] = useState(false);

  const [attendanceSummary, setAttendanceSummary] = useState({
    Present: 0,
    Absent: 0,
    Late: 0,
    Excused: 0,
  });

  const [memberNotifications, setMemberNotifications] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  /*
    Mount portal after client hydration
  */
  useEffect(() => {
    setMounted(true);
  }, []);

  /*
    Fetch member attendance history and notifications
    whenever the selected member changes
  */
  useEffect(() => {
    if (!member?.id) {
      return;
    }

    const fetchMemberAttendance = async () => {
      try {
        setHistoryLoading(true);

        const response = await fetch(
          `/api/welfare/attendance?memberId=${member.id}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch member attendance history."
          );
        }

        const data = await response.json();

        setAttendanceSummary(
          data.summary || {
            Present: 0,
            Absent: 0,
            Late: 0,
            Excused: 0,
          }
        );

        setMemberNotifications(data.notifications || []);
      } catch (error) {
        console.error(
          "Member attendance history error:",
          error
        );

        setAttendanceSummary({
          Present: 0,
          Absent: 0,
          Late: 0,
          Excused: 0,
        });

        setMemberNotifications([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchMemberAttendance();
  }, [member?.id]);

  /*
    Do not render until the portal can safely use document.body
  */
  if (!mounted || !member) {
    return null;
  }

  const formattedAttendanceDate = selectedDate
    ? new Intl.DateTimeFormat("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(`${selectedDate}T00:00:00`))
    : "Today";

  const initials = `${member.firstname?.charAt(0) || ""}${
    member.lastname?.charAt(0) || ""
  }`;

  const formattedDob = member.dob
    ? new Intl.DateTimeFormat("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(member.dob))
    : "Not provided";

  const attendanceStatus = member.attendance || "Not Marked";

  const attendanceStyles = {
    Present: "bg-green-50 text-green-700",
    Absent: "bg-red-50 text-red-700",
    Late: "bg-amber-50 text-amber-700",
    Excused: "bg-blue-50 text-blue-700",
    "Not Marked": "bg-gray-100 text-gray-500",
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 z-[9999] h-screen w-full max-w-md overflow-y-auto bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Profile */}
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-rotaract/10 text-base font-semibold text-rotaract">
                {initials}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-gray-900">
                  {member.firstname} {member.lastname}
                </h2>

                <p className="mt-0.5 text-sm text-gray-500">
                  {member.position || "Member"}
                </p>

                <span className="mt-2 inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                  {member.status}
                </span>
              </div>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close member profile"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Attendance */}
        <div className="border-b border-gray-100 px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Attendance
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {formattedAttendanceDate}
              </p>
            </div>

            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                attendanceStyles[attendanceStatus] ||
                attendanceStyles["Not Marked"]
              }`}
            >
              {attendanceStatus}
            </span>
          </div>

          {/* Attendance Buttons */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* Present */}
            <button
              type="button"
              onClick={() =>
                onAttendanceChange(member.id, "Present")
              }
              className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                member.attendance === "Present"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Check size={16} />
              Present
            </button>

            {/* Absent */}
            <button
              type="button"
              onClick={() =>
                onAttendanceChange(member.id, "Absent")
              }
              className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                member.attendance === "Absent"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <UserX size={16} />
              Absent
            </button>

            {/* Late */}
            <button
              type="button"
              onClick={() =>
                onAttendanceChange(member.id, "Late")
              }
              className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                member.attendance === "Late"
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Clock3 size={16} />
              Late
            </button>

            {/* Excused */}
            <button
              type="button"
              onClick={() =>
                onAttendanceChange(member.id, "Excused")
              }
              className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                member.attendance === "Excused"
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <CircleCheck size={16} />
              Excused
            </button>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="border-b border-gray-100 px-5 py-5">
          <h3 className="text-sm font-semibold text-gray-900">
            Attendance Summary
          </h3>

          {historyLoading ? (
            <div className="mt-4 flex items-center justify-center py-5">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-rotaract" />
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-green-100 bg-green-50 px-4 py-3">
                <p className="text-xs text-green-600">
                  Present
                </p>

                <p className="mt-1 text-xl font-semibold text-green-700">
                  {attendanceSummary.Present}
                </p>
              </div>

              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-xs text-red-600">
                  Absent
                </p>

                <p className="mt-1 text-xl font-semibold text-red-700">
                  {attendanceSummary.Absent}
                </p>
              </div>

              <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
                <p className="text-xs text-amber-600">
                  Late
                </p>

                <p className="mt-1 text-xl font-semibold text-amber-700">
                  {attendanceSummary.Late}
                </p>
              </div>

              <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                <p className="text-xs text-blue-600">
                  Excused
                </p>

                <p className="mt-1 text-xl font-semibold text-blue-700">
                  {attendanceSummary.Excused}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Attendance Alerts */}
        <div className="border-b border-gray-100 px-5 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Attendance Alerts
            </h3>

            {memberNotifications.length > 0 && (
              <span className="rounded-full bg-red-50 px-2 py-1 text-[11px] font-medium text-red-600">
                {memberNotifications.length}
              </span>
            )}
          </div>

          <div className="mt-4">
            {memberNotifications.length === 0 ? (
              <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-4">
                <p className="text-sm text-gray-500">
                  No attendance alerts for this member.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {memberNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-lg border px-4 py-3 ${
                      notification.isRead
                        ? "border-gray-200 bg-gray-50"
                        : "border-red-100 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <UserX size={15} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800">
                          Attendance Alert
                        </p>

                        <p className="mt-1 text-xs leading-5 text-gray-600">
                          {notification.message}
                        </p>

                        <p className="mt-1.5 text-[11px] text-gray-400">
                          {notification.createdAt
                            ? new Intl.DateTimeFormat("en-NG", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }).format(
                                new Date(
                                  notification.createdAt
                                )
                              )
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-b border-gray-100 px-5 py-5">
          <h3 className="text-sm font-semibold text-gray-900">
            Contact Information
          </h3>

          <div className="mt-4 space-y-4">
            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                <Mail size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-400">
                  Email
                </p>

                <p className="mt-0.5 break-all text-sm text-gray-700">
                  {member.email || "Not provided"}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                <Phone size={17} />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Phone
                </p>

                <p className="mt-0.5 text-sm text-gray-700">
                  {member.phone || "Not provided"}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                <MapPin size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-400">
                  Address
                </p>

                <p className="mt-0.5 text-sm leading-5 text-gray-700">
                  {member.address || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="px-5 py-5">
          <h3 className="text-sm font-semibold text-gray-900">
            Personal Information
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">
            {/* Gender */}
            <div className="flex items-start gap-3">
              <User
                size={17}
                className="mt-0.5 shrink-0 text-gray-400"
              />

              <div>
                <p className="text-xs text-gray-400">
                  Gender
                </p>

                <p className="mt-0.5 text-sm text-gray-700">
                  {member.gender || "Not provided"}
                </p>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="flex items-start gap-3">
              <CalendarDays
                size={17}
                className="mt-0.5 shrink-0 text-gray-400"
              />

              <div>
                <p className="text-xs text-gray-400">
                  Date of Birth
                </p>

                <p className="mt-0.5 text-sm text-gray-700">
                  {formattedDob}
                </p>
              </div>
            </div>

            {/* Occupation */}
            <div className="col-span-2 flex items-start gap-3">
              <BriefcaseBusiness
                size={17}
                className="mt-0.5 shrink-0 text-gray-400"
              />

              <div>
                <p className="text-xs text-gray-400">
                  Occupation
                </p>

                <p className="mt-0.5 text-sm text-gray-700">
                  {member.occupation || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </aside>
    </>,
    document.body
  );
}