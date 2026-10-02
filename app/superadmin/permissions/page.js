"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
ShieldCheck,
LayoutDashboard,
HeartHandshake,
Check,
X,
Save,
Loader2,
ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";

export default function PermissionsPage() {
const [positions, setPositions] = useState([]);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);


useEffect(() => {
loadPositions();
}, []);

async function loadPositions() {
try {
setLoading(true);


  const response = await fetch(
    "/api/superadmin/permissions"
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Unable to load permissions."
    );
  }

  setPositions(data.positions || []);
} catch (error) {
  console.error(
    "Load permissions error:",
    error
  );

  toast.error(
    error.message ||
      "Unable to load permissions."
  );
} finally {
  setLoading(false);
}

}

function togglePermission(positionId, permission) {
setPositions((current) =>
current.map((position) =>
position.id === positionId
? {
...position,
[permission]:
!position[permission],
}
: position
)
);
}

async function saveAllPermissions() {
try {
setSaving(true);


  const response = await fetch(
    "/api/superadmin/permissions",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        positions: positions.map((position) => ({
          positionId: position.id,
          adminAccess:
            position.adminAccess,
          welfareAccess:
            position.welfareAccess,
        })),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Unable to save permissions."
    );
  }

  toast.success(
    "Permissions saved successfully."
  );
} catch (error) {
  console.error(
    "Save permissions error:",
    error
  );

  toast.error(
    error.message ||
      "Unable to save permissions."
  );
} finally {
  setSaving(false);
}

}

function toggleTheme() {
const nextMode = !darkMode;


setDarkMode(nextMode);

if (nextMode) {
  document.documentElement.classList.add(
    "dark"
  );
  localStorage.setItem("theme", "dark");
} else {
  document.documentElement.classList.remove(
    "dark"
  );
  localStorage.setItem("theme", "light");
}
}

return ( 
<main className="min-h-screen bg-[var(--cream)] px-5 py-8 transition-colors md:px-8"> <div className="mx-auto w-full max-w-7xl">

    {/* Top */}
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

      {/* Header */}
      <div>
            <Link
                href="/superadmin"
                className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#d41367]"
            >
                <ArrowLeft size={16} />
                Super Admin
            </Link>

            <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d41367] text-white">
                    <ShieldCheck size={22} />
                </div>

                <div>
                    <p className="text-sm font-medium text-[#d41367]">
                        Administration
                    </p>

                    <h1 className="text-2xl font-semibold text-[var(--dark)]">
                        Permissions
                    </h1>
                </div>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-gray-500">
                Manage which areas of the platform each board position can access.
            </p>
        </div>
    </div>

    {/* Permissions */}
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Position
              </th>

              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                Admin Access
              </th>

              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                Welfare Access
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-12 text-center"
                >
                  <Loader2
                    size={22}
                    className="mx-auto animate-spin text-[#d41367]"
                  />

                  <p className="mt-3 text-sm text-gray-500">
                    Loading permissions...
                  </p>
                </td>
              </tr>
            ) : positions.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-12 text-center text-sm text-gray-500"
                >
                  No positions available.
                </td>
              </tr>
            ) : (
              positions.map((position) => (
                <tr
                  key={position.id}
                  className="transition hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">
                      {position.name}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <PermissionToggle
                      enabled={
                        position.adminAccess
                      }
                      onClick={() =>
                        togglePermission(
                          position.id,
                          "adminAccess"
                        )
                      }
                    />
                  </td>

                  <td className="px-6 py-4 text-center">
                    <PermissionToggle
                      enabled={
                        position.welfareAccess
                      }
                      onClick={() =>
                        togglePermission(
                          position.id,
                          "welfareAccess"
                        )
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile / tablet cards */}
      <div className="grid gap-4 p-4 sm:grid-cols-2 md:hidden">
        {loading ? (
            <div className="col-span-full py-12 text-center">
                <Loader2
                    size={22}
                    className="mx-auto animate-spin text-[#d41367]"
                />

                <p className="mt-3 text-sm text-gray-500">
                    Loading permissions...
                </p>
            </div>

        ) : positions.length === 0 ? ( 
            <div className="col-span-full py-12 text-center text-sm text-gray-500">
                No positions available. 
            </div>

        ) : (
            positions.map((position) => ( 
            <div
                key={position.id}
                className="rounded-2xl border border-gray-200 bg-white p-5"
            > 
            <div className="mb-4"> 
                <p className="text-base font-bold text-gray-900">
                    {position.name} 
                </p> 
            </div>

            <div className="space-y-3">
                <PermissionRow
                    icon={
                    <LayoutDashboard size={17} />
                    }
                    label="Admin Access"
                    enabled={position.adminAccess}
                    onClick={() =>
                    togglePermission(
                        position.id,
                        "adminAccess"
                    )
                    }
                />

                <PermissionRow
                    icon={
                    <HeartHandshake size={17} />
                    }
                    label="Welfare Access"
                    enabled={position.welfareAccess}
                    onClick={() =>
                    togglePermission(
                        position.id,
                        "welfareAccess"
                    )
                    }
                />
            </div>
        </div>
        ))

        )}

        </div>

      {/* Save Changes */}
      {!loading && positions.length > 0 && (
        <div className="flex items-center justify-end border-t border-gray-200 bg-gray-50 px-4 py-4 md:px-6">
          <button
            type="button"
            onClick={saveAllPermissions}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#d41367] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b91059] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <Save size={16} />
            )}

            {saving
              ? "Saving Changes..."
              : "Save Changes"}
          </button>
        </div>
      )}
    </section>
  </div>
</main>

);
}

function PermissionToggle({
    enabled,
    onClick,
    }) {

        return (
            <button
                type="button"
                onClick={onClick}
                aria-label={
                enabled
                    ? "Disable permission"
                    : "Enable permission"
                }
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${
                        enabled
                        ? "bg-[#fce1ec] text-[#d41367]"
                        : "bg-gray-100 text-gray-400"
                    }`}
                >
                    {
                    enabled 
                        ? ( <Check size={17} strokeWidth={2.5} />
                        ) : ( <X size={17} strokeWidth={2.5} />
                )} 
            </button>
    );
    }

function PermissionRow({
    icon,
    label,
    enabled,
    onClick,
    }) {
    
        return ( 
            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"> 
                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            enabled
                            ? "bg-[#fce1ec] text-[#d41367]"
                            : "bg-gray-100 text-gray-400"
                        }`}
                >
                        {icon} 
                    </div>

                    <span className="text-sm font-semibold text-gray-800">
                        {label}
                    </span>
                </div>

                <PermissionToggle
                    enabled={enabled}
                    onClick={onClick}
                />
            </div>
);
}
