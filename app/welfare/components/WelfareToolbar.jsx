"use client";

import { useState } from "react";
import {
  Search,
  Download,
  X,
  FileSpreadsheet,
  Users,
  BriefcaseBusiness,
} from "lucide-react";

export default function WelfareToolbar({
  search = "",
  setSearch,
  attendanceFilter = "All",
  setAttendanceFilter,
  selectedDate,
  onDateChange,
  onToday,
  onYesterday,
  isToday = false,
  onExport,
}) {
  const [showExport, setShowExport] = useState(false);
  const [exportType, setExportType] = useState("all");

  const handleExport = () => {
    onExport(exportType);
    setShowExport(false);
  };

  return (
    <>
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
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
            onChange={(event) =>
              setAttendanceFilter(event.target.value)
            }
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-rotaract focus:ring-2 focus:ring-rotaract/10"
          >
            <option value="All">All Attendance</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
            <option value="Excused">Excused</option>
          </select>

          {/* Date controls */}
          <div className="flex h-10 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <button
              type="button"
              onClick={onToday}
              className={`px-3 text-sm transition ${
                isToday
                  ? "bg-rotaract text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Today
            </button>

            <button
              type="button"
              onClick={onYesterday}
              className="border-l border-gray-200 px-3 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              Yesterday
            </button>

            <label className="flex cursor-pointer items-center border-l border-gray-200 px-3 text-sm text-gray-700 hover:bg-gray-50">
              <span className="mr-2">Date</span>

              <input
                type="date"
                value={selectedDate}
                onChange={(event) =>
                  onDateChange(event.target.value)
                }
                className="cursor-pointer border-0 bg-transparent p-0 text-sm text-gray-700 outline-none"
              />
            </label>
          </div>

          {/* Export */}
          <button
            type="button"
            onClick={() => setShowExport(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Export Modal */}
      {showExport && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/30 p-4"
          onClick={() => setShowExport(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Export Attendance
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Download attendance for the selected session.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowExport(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close export"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 px-5 py-5">
              {/* Member Type */}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Members
                </p>

                <div className="mt-3 space-y-2">
                  {/* All Members */}
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                      exportType === "all"
                        ? "border-rotaract/30 bg-rotaract/5"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="exportType"
                      value="all"
                      checked={exportType === "all"}
                      onChange={() => setExportType("all")}
                      className="accent-rotaract"
                    />

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                      <Users size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        All Members
                      </p>

                      <p className="text-xs text-gray-500">
                        Export the complete attendance list.
                      </p>
                    </div>
                  </label>

                  {/* Board Members */}
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                      exportType === "board"
                        ? "border-rotaract/30 bg-rotaract/5"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="exportType"
                      value="board"
                      checked={exportType === "board"}
                      onChange={() => setExportType("board")}
                      className="accent-rotaract"
                    />

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                      <BriefcaseBusiness size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Board Members
                      </p>

                      <p className="text-xs text-gray-500">
                        Export members with a board position.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* File Format */}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  File Format
                </p>

                <div className="mt-3 flex items-center gap-3 rounded-lg border border-rotaract/30 bg-rotaract/5 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-rotaract">
                    <FileSpreadsheet size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      CSV Spreadsheet
                    </p>

                    <p className="text-xs text-gray-500">
                      Note: Can be opened/viewed with excel
                    </p>
                  </div>
                </div>
              </div>

              {/* Selected Session */}
              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <p className="text-xs text-gray-500">
                  Attendance Session
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {selectedDate}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setShowExport(false)}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-lg bg-rotaract px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rotaract/90"
              >
                <Download size={16} />
                Download CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}