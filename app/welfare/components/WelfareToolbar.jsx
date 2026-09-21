"use client";

import { Search } from "lucide-react";

export default function WelfareToolbar({
  search = "",
  setSearch,
  attendanceFilter = "All",
  setAttendanceFilter,
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Section heading */}
      <div>
        <h2 className="text-base font-semibold text-gray-900">
          Today&apos;s Attendance
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Mark attendance and select a member to view their profile.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative">
          <Search
            size={17}
            strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search members..."
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rotaract focus:ring-2 focus:ring-rotaract/10 sm:w-64"
          />
        </div>

        {/* Attendance filter */}
        <select
          value={attendanceFilter}
          onChange={(event) => setAttendanceFilter(event.target.value)}
          className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-rotaract focus:ring-2 focus:ring-rotaract/10"
        >
          <option value="All">All Attendance</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Present">Late</option>
          <option value="Absent">Excused</option>
        </select>
      </div>
    </div>
  );
}