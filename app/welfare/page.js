"use client";

import { useEffect, useMemo, useState } from "react";

import WelfareHeader from "./components/WelfareHeader";
import WelfareStats from "./components/WelfareStats";
import WelfareToolbar from "./components/WelfareToolbar";
import WelfareAttendanceTable from "./components/WelfareAttendanceTable";
import WelfareMemberDrawer from "./components/WelfareMemberDrawer";

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getYesterdayString() {
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  return getLocalDateString(yesterday);
}

export default function WelfarePage() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("All");
  const [selectedMember, setSelectedMember] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [selectedDate, setSelectedDate] = useState(
    getLocalDateString()
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
    Lock the page behind the member drawer
  */
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

  /*
    Fetch attendance whenever the selected date changes
  */
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/welfare/attendance?date=${selectedDate}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch attendance.");
        }

        const data = await response.json();

        setMembers(data);

        // Close any open drawer when changing dates
        setSelectedMember(null);
      } catch (error) {
        console.error("Welfare attendance fetch error:", error);

        setError("Unable to load members and attendance.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedDate]);

  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/welfare/notifications");

      if (!response.ok) {
        throw new Error("Failed to fetch notifications.");
      }

      const data = await response.json();

      setNotifications(data);
    } catch (error) {
      console.error(
        "Welfare notifications fetch error:",
        error
      );
    }
  };

  fetchNotifications();
}, []);

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
          attendanceDate: selectedDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save attendance."
        );
      }

    if (data.shouldNotify && data.notification) {
  setNotifications((currentNotifications) => [
    data.notification,
    ...currentNotifications,
  ]);
}
      /*
        Update the table after the database confirms the change
      */
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

      /*
        Keep the drawer in sync if it is currently open
      */
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

  const handleExport = (exportType) => {
  let exportMembers = [...members];


if (exportType === "board") {
  exportMembers = exportMembers.filter(
    (member) =>
      member.positionId &&
      member.positionId.toString().toLowerCase() !== "member"
  );
}

  const headers = [
    "Member ID",
    "First Name",
    "Last Name",
    "Position",
    "Email",
    "Phone",
    "Attendance",
  ];

  const rows = exportMembers.map((member) => [
    member.id,
    member.firstname || "",
    member.lastname || "",
    member.position || "Member",
    member.email || "",
    member.phone || "",
    member.attendance || "Not Marked",
  ]);

  const escapeCsvValue = (value) => {
    const stringValue = String(value ?? "");

    return `"${stringValue.replace(/"/g, '""')}"`;
  };

  const csv = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => row.map(escapeCsvValue).join(",")),
  ].join("\n");

  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const memberLabel =
    exportType === "board" ? "board-members" : "all-members";

  link.href = url;
  link.download = `attendance-${memberLabel}-${selectedDate}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

  const handleToday = () => {
    setSelectedDate(getLocalDateString());
  };

  const handleYesterday = () => {
    setSelectedDate(getYesterdayString());
  };

  const today = getLocalDateString();


const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await fetch("/api/welfare/notifications", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to mark notification as read."
      );
    }

    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              isRead: true,
              read: true,
            }
          : notification
      )
    );
  } catch (error) {
    console.error(
      "Mark notification as read error:",
      error
    );
  }
};


const markAllNotificationsAsRead = async () => {
  try {
    const response = await fetch("/api/welfare/notifications", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        markAll: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to mark notifications as read."
      );
    }

    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: true,
        read: true,
      }))
    );
  } catch (error) {
    console.error(
      "Mark all notifications as read error:",
      error
    );
  }
};


  return (
    <div className="space-y-6 p-4 lg:p-6">
      <WelfareHeader
        notifications={notifications}
        onMarkAsRead={markNotificationAsRead}
        onMarkAllAsRead={markAllNotificationsAsRead}
      />

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
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onToday={handleToday}
          onYesterday={handleYesterday}
          isToday={selectedDate === today}
          onExport={handleExport}
        />

        {loading ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-rotaract" />

            <p className="mt-4 text-sm text-gray-500">
              Loading attendance...
            </p>
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center">
            <h3 className="text-sm font-semibold text-gray-900">
              Unable to load attendance
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
        selectedDate={selectedDate}
      />
    </div>
  );
}