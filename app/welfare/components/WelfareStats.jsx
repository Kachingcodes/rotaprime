import {
  Users,
  UserCheck,
  UserX,
  Percent,
} from "lucide-react";

export default function WelfareStats({
  totalMembers = 0,
  presentCount = 0,
  absentCount = 0,
  attendancePercentage = 0,
}) {
  const stats = [
    {
      label: "Total Members",
      value: totalMembers,
      icon: Users,
      iconWrapper: "bg-gray-100 text-gray-600",
    },
    {
      label: "Present",
      value: presentCount,
      icon: UserCheck,
      iconWrapper: "bg-green-50 text-green-600",
    },
    {
      label: "Absent",
      value: absentCount,
      icon: UserX,
      iconWrapper: "bg-red-50 text-red-500",
    },
    {
      label: "Attendance",
      value: `${attendancePercentage}%`,
      icon: Percent,
      iconWrapper: "bg-rotaract/10 text-rotaract",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {stat.label}
                </p>

                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconWrapper}`}
              >
                <Icon size={20} strokeWidth={2} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}