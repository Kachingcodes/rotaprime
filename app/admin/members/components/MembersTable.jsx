"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  Check,
  X,
  Pencil,
  MoreVertical,
  Users,
} from "lucide-react";

import StatusBadge from "./StatusBadge";

export default function MembersTable({
  members,
  positions,
  loading,
  saving,
  onView,
  onEdit,
  onAccept,
  onReject,
  onAssignPosition,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [rejectMember, setRejectMember] = useState(null);

  // ========================================
  // Close menu when clicking outside
  // ========================================
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        openMenu &&
        !e.target.closest("[data-member-actions]")
      ) {
        setOpenMenu(null);
        setMenuPosition(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [openMenu]);

  // ========================================
  // Close menu when scrolling
  // ========================================
  useEffect(() => {
    function handleScroll() {
      setOpenMenu(null);
      setMenuPosition(null);
    }

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
        true
      );
    };
  }, []);

  // ========================================
  // Loading
  // ========================================
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-sm text-gray-500">
            Loading members...
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // Empty state
  // ========================================
  if (members.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <Users size={25} />
          </div>

          <h3 className="mt-4 font-semibold text-gray-900">
            No members found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-gray-500">
            New membership applications will appear here.
          </p>

        </div>
      </div>
    );
  }

  // ========================================
  // Open actions menu
  // ========================================
  function handleOpenMenu(e, memberId) {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();

    const menuWidth = 190;
    const menuHeight = 190;
    const spacing = 8;
    const padding = 12;

    let left = rect.right - menuWidth;
    let top = rect.bottom + spacing;

    // Keep inside viewport horizontally
    if (left < padding) {
      left = padding;
    }

    if (left + menuWidth > window.innerWidth - padding) {
      left = window.innerWidth - menuWidth - padding;
    }

    // Open above button if there isn't enough room below
    if (
      top + menuHeight >
      window.innerHeight - padding
    ) {
      top = rect.top - menuHeight - spacing;
    }

    setMenuPosition({
      top,
      left,
    });

    setOpenMenu((current) =>
      current === memberId ? null : memberId
    );
  }

  // Find currently selected member
  const activeMember = members.find(
    (member) => member.id === openMenu
  );

  return (
    <>
      {/* ========================================
          TABLE
      ======================================== */}
      <div className="overflow-hidden hidden lg:block rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px] text-left">

            {/* Header */}
            <thead className="border-b border-gray-200 bg-gray-50">

              <tr>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Member
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Phone
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Occupation
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Position
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                  Actions
                </th>

              </tr>

            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100">

              {members.map((member) => (

                <tr
                  key={member.id}
                  className="transition hover:bg-gray-50"
                >

                  {/* Member */}
                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rotaract/10 text-sm font-bold text-rotaract">
                        {(member.firstname?.[0] || "").toUpperCase()}
                        {(member.lastname?.[0] || "").toUpperCase()}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate font-semibold text-gray-900">
                          {member.firstname} {member.lastname}
                        </p>

                        <p className="truncate text-sm text-gray-500">
                          {member.email || "No email"}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* Phone */}
                  <td className="px-6 py-5 text-sm text-gray-600">
                    {member.phone || "—"}
                  </td>

                  {/* Occupation */}
                  <td className="px-6 py-5 text-sm text-gray-600">
                    {member.occupation || "—"}
                  </td>

                  {/* Position */}
                  <td className="px-6 py-5">

                    <select
                      value={member.position?.id || ""}
                      onChange={(e) =>
                        onAssignPosition(
                          member,
                          e.target.value
                        )
                      }
                      disabled={saving}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-rotaract disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      <option value="">
                        Member
                      </option>

                      {positions.map((position) => (

                        <option
                          key={position.id}
                          value={position.id}
                        >
                          {position.name}
                        </option>

                      ))}

                    </select>

                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">

                    <StatusBadge
                      status={member.status}
                    />

                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5">

                    <div
                      className="flex justify-center"
                      data-member-actions
                    >

                      <button
                        type="button"
                        onClick={(e) =>
                          handleOpenMenu(
                            e,
                            member.id
                          )
                        }
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                          openMenu === member.id
                            ? "border-rotaract bg-rotaract/10 text-rotaract"
                            : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                        aria-label="Member actions"
                      >
                        <MoreVertical size={18} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* MOBILE ONLY */}
<div className="space-y-3 flex flex-col lg:hidden">

  {members.map((member) => (
    <div
      key={member.id}
      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
    >

      {/* Header */}
      <div className="flex items-center justify-between gap-3">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rotaract/10 text-sm font-bold text-rotaract">
            {(member.firstname?.[0] || "").toUpperCase()}
            {(member.lastname?.[0] || "").toUpperCase()}
          </div>

          <div className="min-w-0">

            <p className="truncate font-bold text-gray-900">
              {member.firstname} {member.lastname}
            </p>

            <p className="truncate text-xs text-gray-500">
              {member.email || "No email"}
            </p>

          </div>

        </div>

        {/* Mobile actions */}
        <div data-member-actions>

          <button
            type="button"
            onClick={(e) =>
              handleOpenMenu(e, member.id)
            }
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition ${
              openMenu === member.id
                ? "border-rotaract bg-rotaract/10 text-rotaract"
                : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
            }`}
            aria-label="Member actions"
          >
            <MoreVertical size={18} />
          </button>

        </div>

      </div>

      {/* Details */}
      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Phone
          </p>

          <p className="mt-1 truncate text-sm font-medium text-gray-700">
            {member.phone || "—"}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Occupation
          </p>

          <p className="mt-1 truncate text-sm font-medium text-gray-700">
            {member.occupation || "—"}
          </p>
        </div>

      </div>

      {/* Position */}
      <div className="mt-4">

        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Position
        </label>

        <select
          value={member.position?.id || ""}
          onChange={(e) =>
            onAssignPosition(
              member,
              e.target.value
            )
          }
          disabled={saving}
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-semibold text-gray-700 outline-none transition focus:border-rotaract focus:bg-white focus:ring-2 focus:ring-rotaract/10 disabled:cursor-not-allowed disabled:opacity-50"
        >

          <option value="">
            Member
          </option>

          {positions.map((position) => (
            <option
              key={position.id}
              value={position.id}
            >
              {position.name}
            </option>
          ))}

        </select>

      </div>

      {/* Status */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">

        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Membership status
        </span>

        <StatusBadge
          status={member.status}
        />

      </div>

    </div>
  ))}

</div>


      {/* ========================================
          ACTION CARD
          IMPORTANT:
          This is OUTSIDE the table.
      ======================================== */}
      {openMenu &&
        menuPosition &&
        activeMember && (
          <div
            data-member-actions
            className="fixed z-[100] w-[190px] overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
            }}
          >

            {/* View */}
            <button
              type="button"
              onClick={() => {
                setOpenMenu(null);
                setMenuPosition(null);
                onView(activeMember);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Eye
                size={17}
                className="text-gray-500"
              />

              <span>View member</span>
            </button>


            {/* Edit */}
            <button
              type="button"
              onClick={() => {
                setOpenMenu(null);
                setMenuPosition(null);
                onEdit(activeMember);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Pencil
                size={17}
                className="text-gray-500"
              />

              <span>Edit member</span>
            </button>


            {/* Divider */}
            <div className="my-1 border-t border-gray-100" />


            {/* Accept */}
            {activeMember.status !== "accepted" && (
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setOpenMenu(null);
                  setMenuPosition(null);
                  onAccept(activeMember);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-green-600 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={17} />

                <span>Accept member</span>
              </button>
            )}


            {/* Reject */}
            {activeMember.status !== "rejected" && (
            <button
                type="button"
                disabled={saving}
                onClick={() => {
                setOpenMenu(null);
                setMenuPosition(null);
                setRejectMember(activeMember);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <X size={17} />

                <span>Reject member</span>
            </button>
            )}

          </div>
        )}

        {/* ========================================
            REJECT CONFIRMATION MODAL
        ======================================== */}
        {rejectMember && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">

            {/* Backdrop */}
            <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => {
                if (!saving) {
                setRejectMember(null);
                }
            }}
            />

            {/* Modal */}
            <div
            className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            >

            {/* Icon */}
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600">
                <X size={20} />
            </div>

            {/* Content */}
            <div className="mt-4">

                <h3 className="text-lg font-bold text-gray-900">
                Reject member?
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                Are you sure you want to reject{" "}
                <span className="font-semibold text-gray-900">
                    {rejectMember.firstname} {rejectMember.lastname}
                </span>
                ?
                </p>

                <p className="mt-1 text-sm text-gray-500">
                This will change their membership status to rejected.
                </p>

            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                type="button"
                disabled={saving}
                onClick={() => setRejectMember(null)}
                className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                CANCEL
                </button>

                <button
                type="button"
                disabled={saving}
                onClick={async () => {
                    await onReject(rejectMember);
                    setRejectMember(null);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                <X size={16} />

                {saving ? "REJECTING..." : "REJECT MEMBER"}
                </button>

            </div>

            </div>

        </div>
        )}
    </>
  );
}