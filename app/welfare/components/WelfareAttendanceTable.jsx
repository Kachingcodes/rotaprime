"use client";

import {
  BadgeCheck,
  Check,
  ChevronRight,
  Clock3,
  UserX,
  Users,
} from "lucide-react";

const attendanceConfig = {
  Present: {
    icon: Check,
    classes: "bg-green-50 text-green-700",
  },
  Absent: {
    icon: UserX,
    classes: "bg-red-50 text-red-700",
  },
  Late: {
    icon: Clock3,
    classes: "bg-amber-50 text-amber-700",
  },
  Excused: {
    icon: BadgeCheck,
    classes: "bg-blue-50 text-blue-700",
  },
  "Not Marked": {
    icon: Clock3,
    classes: "bg-gray-100 text-gray-500",
  },
};

export default function WelfareAttendanceTable({
  members = [],
  onMemberClick,
  onAttendanceChange,
}) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70">
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Member
              </th>

              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Position
              </th>

              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Membership
              </th>

              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Attendance
              </th>

              <th className="w-10 px-5 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr
                key={member.id}
                className="group border-b border-gray-100 last:border-0 hover:bg-gray-50/60"
              >
                {/* Member */}
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onMemberClick(member)}
                    className="flex items-center gap-3 text-left"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                      {member.firstname?.charAt(0)}
                      {member.lastname?.charAt(0)}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900 transition group-hover:text-rotaract">
                        {member.firstname} {member.lastname}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {member.email}
                      </p>
                    </div>
                  </button>
                </td>

                {/* Position */}
                <td className="px-5 py-4">
                  <span className="text-sm text-gray-600">
                    {member.position || "Member"}
                  </span>
                </td>

                {/* Membership Status */}
                <td className="px-5 py-4">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                    {member.status}
                  </span>
                </td>

                {/* Attendance */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {/* Present */}
                    <button
                      type="button"
                      onClick={() =>
                        onAttendanceChange(member.id, "Present")
                      }
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        member.attendance === "Present"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      <Check size={14} />
                      Present
                    </button>

                    {/* Absent */}
                    <button
                      type="button"
                      onClick={() =>
                        onAttendanceChange(member.id, "Absent")
                      }
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        member.attendance === "Absent"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      <UserX size={14} />
                      Absent
                    </button>

                    {/* Late */}
                    <button
                      type="button"
                      onClick={() =>
                        onAttendanceChange(member.id, "Late")
                      }
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        member.attendance === "Late"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      <Clock3 size={14} />
                      Late
                    </button>

                    {/* Excused */}
                    <button
                      type="button"
                      onClick={() =>
                        onAttendanceChange(member.id, "Excused")
                      }
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        member.attendance === "Excused"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      <BadgeCheck size={14} />
                      Excused
                    </button>
                  </div>
                </td>

                {/* Profile Arrow */}
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onMemberClick(member)}
                    className="text-gray-300 transition group-hover:text-gray-500"
                    aria-label={`View ${member.firstname} ${member.lastname}`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile List */}
      <div className="divide-y divide-gray-100 md:hidden">
        {members.map((member) => {
          const attendanceStatus =
            member.attendance || "Not Marked";

          const attendanceStyle =
            attendanceConfig[attendanceStatus] ||
            attendanceConfig["Not Marked"];

          const AttendanceIcon = attendanceStyle.icon;

          return (
            <div key={member.id} className="p-4">
              {/* Member Information */}
              <button
                type="button"
                onClick={() => onMemberClick(member)}
                className="flex w-full items-center gap-3 text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                  {member.firstname?.charAt(0)}
                  {member.lastname?.charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {member.firstname} {member.lastname}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {member.position || "Member"}
                  </p>
                </div>

                <ChevronRight
                  size={18}
                  className="shrink-0 text-gray-400"
                />
              </button>

              {/* Current Attendance */}
              <div className="mt-4">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${attendanceStyle.classes}`}
                >
                  <AttendanceIcon size={13} />
                  {attendanceStatus}
                </span>
              </div>

              {/* Attendance Controls */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {/* Present */}
                <button
                  type="button"
                  onClick={() =>
                    onAttendanceChange(member.id, "Present")
                  }
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    member.attendance === "Present"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  <Check size={14} />
                  Present
                </button>

                {/* Absent */}
                <button
                  type="button"
                  onClick={() =>
                    onAttendanceChange(member.id, "Absent")
                  }
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    member.attendance === "Absent"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  <UserX size={14} />
                  Absent
                </button>

                {/* Late */}
                <button
                  type="button"
                  onClick={() =>
                    onAttendanceChange(member.id, "Late")
                  }
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    member.attendance === "Late"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  <Clock3 size={14} />
                  Late
                </button>

                {/* Excused */}
                <button
                  type="button"
                  onClick={() =>
                    onAttendanceChange(member.id, "Excused")
                  }
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    member.attendance === "Excused"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  <BadgeCheck size={14} />
                  Excused
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {members.length === 0 && (
        <div className="px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <Users size={22} />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-gray-900">
            No members found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your search or attendance filter.
          </p>
        </div>
      )}
    </>
  );
}