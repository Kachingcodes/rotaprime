"use client";

import { useEffect, useMemo, useState } from "react";

import WelfareHeader from "./components/WelfareHeader";
import WelfareStats from "./components/WelfareStats";
import WelfareToolbar from "./components/WelfareToolbar";
import WelfareAttendanceTable from "./components/WelfareAttendanceTable";
import WelfareMemberDrawer from "./components/WelfareMemberDrawer";

export default function WelfarePage() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("All");
  const [selectedMember, setSelectedMember] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/welfare/attendance");

        if (!response.ok) {
          throw new Error("Failed to fetch attendance.");
        }

        const data = await response.json();

        setMembers(data);
      } catch (error) {
        console.error("Welfare attendance fetch error:", error);
        setError("Unable to load members and attendance.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

    useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMember]);

  const presentCount = members.filter(
    (member) => member.attendance === "Present"
  ).length;

  const absentCount = members.filter(
    (member) => member.attendance === "Absent"
  ).length;

    const lateCount = members.filter(
    (member) => member.attendance === "Late"
  ).length;

    const excusedCount = members.filter(
    (member) => member.attendance === "Excused"
  ).length;

  const totalMembers = members.length;

  const attendancePercentage =
    totalMembers > 0
      ? Math.round((presentCount / totalMembers) * 100)
      : 0;

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const fullName =
        `${member.firstname} ${member.lastname}`.toLowerCase();

      const searchTerm = search.toLowerCase();

      const matchesSearch =
        fullName.includes(searchTerm) ||
        member.email?.toLowerCase().includes(searchTerm) ||
        member.position?.toLowerCase().includes(searchTerm);

      const matchesAttendance =
        attendanceFilter === "All" ||
        member.attendance === attendanceFilter;

      return matchesSearch && matchesAttendance;
    });
  }, [members, search, attendanceFilter]);

  const toggleAttendance = async (memberId, status) => {
    try {
      const response = await fetch("/api/welfare/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save attendance."
        );
      }

      // Update the table after the database confirms the change
      setMembers((currentMembers) =>
        currentMembers.map((member) =>
          member.id === memberId
            ? {
                ...member,
                attendance: data.status,
              }
            : member
        )
      );

      // Keep the drawer in sync if it is currently open
      setSelectedMember((currentMember) => {
        if (!currentMember || currentMember.id !== memberId) {
          return currentMember;
        }

        return {
          ...currentMember,
          attendance: data.status,
        };
      });
    } catch (error) {
      console.error("Attendance update error:", error);

      setError(
        error.message || "Unable to save attendance."
      );
    }
  };

  return (
    <div className="space-y-6 p-4">
      <WelfareHeader />

      <WelfareStats
        totalMembers={totalMembers}
        presentCount={presentCount}
        absentCount={absentCount}
        attendancePercentage={attendancePercentage}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <WelfareToolbar
          search={search}
          setSearch={setSearch}
          attendanceFilter={attendanceFilter}
          setAttendanceFilter={setAttendanceFilter}
        />

        {loading ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-rotaract" />

            <p className="mt-4 text-sm text-gray-500">
              Loading members...
            </p>
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center">
            <h3 className="text-sm font-semibold text-gray-900">
              Unable to load members
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {error}
            </p>
          </div>
        ) : (
          <WelfareAttendanceTable
            members={filteredMembers}
            onMemberClick={setSelectedMember}
            onAttendanceChange={toggleAttendance}
          />
        )}
      </div>

      <WelfareMemberDrawer
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onAttendanceChange={toggleAttendance}
      />
    </div>
  );
}