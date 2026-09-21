"use client";

import { CalendarDays, HeartHandshake } from "lucide-react";

export default function WelfareHeader() {
  const today = new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

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

      {/* Date */}
      <div className="flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
        <CalendarDays size={17} className="text-gray-400" />
        <span>{today}</span>
      </div>
    </div>
  );
}