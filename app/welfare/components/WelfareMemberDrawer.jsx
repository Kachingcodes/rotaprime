"use client";

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
}) {
  if (!member) return null;

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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 z-50 h-screen w-full max-w-md overflow-y-auto bg-white shadow-2xl">
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

        {/* Today's Attendance */}
        <div className="border-b border-gray-100 px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Today&apos;s Attendance
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Record this member&apos;s attendance.
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
                <p className="text-xs text-gray-400">Email</p>

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
                <p className="text-xs text-gray-400">Phone</p>

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
                <p className="text-xs text-gray-400">Address</p>

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
                <p className="text-xs text-gray-400">Gender</p>

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
    </>
  );
}