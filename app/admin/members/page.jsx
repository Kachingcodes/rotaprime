"use client";

import { useEffect, useState } from "react";

import MembersHeader from "./components/MembersHeader";
//import MembersStats from "./components/MembersStats";
import MembersTable from "./components/MembersTable";
import MemberDrawer from "./components/MemberDrawer";
import MemberFormModal from "./components/MemberFormModal";
import MemberImportModal from "./components/MemberImportModal";


export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [positions, setPositions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [selectedMember, setSelectedMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/members");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load members.");
      }

      setMembers(data.members || []);

      setPositions(
        (data.positions || []).filter(
          (position) => position.active
        )
      );
    } catch (error) {
      console.error(error);
      setError(error.message || "Unable to load members.");
    } finally {
      setLoading(false);
    }
  }

async function updateMember(memberId, updates) {
  try {
    setSaving(true);
    setError("");

    const response = await fetch(
      `/api/admin/members/${memberId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update member."
      );
    }

    setMembers((current) =>
      current.map((member) => {
        if (member.id !== memberId) {
          return member;
        }

        return {
          ...member,
          ...updates,
        };
      })
    );

    // Keep the drawer in sync too
    setSelectedMember((current) => {
      if (!current || current.id !== memberId) {
        return current;
      }

      return {
        ...current,
        ...updates,
      };
    });

  } catch (error) {
    console.error("UPDATE MEMBER ERROR:", error);

    setError(
      error.message || "Unable to update member."
    );
  } finally {
    setSaving(false);
  }
}


  async function acceptMember(member) {
    await updateMember(member.id, {
      status: "accepted",
    });
  }

  async function rejectMember(member) {
  await updateMember(member.id, {
    status: "rejected",
  });
}

  async function assignPosition(member, positionId) {
    if (!positionId) {
      await updateMember(member.id, {
        position: null,
      });

      return;
    }

    const position = positions.find(
      (item) => item.id === positionId
    );

    if (!position) return;

    await updateMember(member.id, {
      position: {
        id: position.id,
        name: position.name,
      },
    });
  }

  const searchTerm = search.toLowerCase();

  const filteredMembers = members.filter((member) => {
    const fullName =
      `${member.firstname || ""} ${member.lastname || ""}`
        .toLowerCase();

    return (
      fullName.includes(searchTerm) ||
      (member.email || "")
        .toLowerCase()
        .includes(searchTerm) ||
      (member.phone || "")
        .toLowerCase()
        .includes(searchTerm)
    );
  });

  function handleMemberSuccess(savedMember, mode) {
  if (mode === "create") {
    setMembers((current) => [savedMember, ...current]);
  }

  if (mode === "edit") {
    setMembers((current) =>
      current.map((member) =>
        member.id === savedMember.id
          ? savedMember
          : member
      )
    );

    setSelectedMember((current) =>
      current?.id === savedMember.id
        ? savedMember
        : current
    );
  }

  setEditingMember(null);
  setShowMemberModal(false);
}

  return (
    <div className="space-y-6">

      <MembersHeader 
        onAddMember={() => {
        setEditingMember(null);
        setShowMemberModal(true);
        }} 
        onImportMembers={() => {
          setShowImportModal(true);
        }}
        />

      {/* <MembersStats members={members} /> */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search members by name, email or phone..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-rotaract focus:bg-white"
        />
      </div>

      <MembersTable
        members={filteredMembers}
        positions={positions}
        loading={loading}
        saving={saving}
        onView={(member) => setSelectedMember(member)}
        onEdit={(member) => {
        setEditingMember(member);
        setShowMemberModal(true);
        }}
        onAccept={acceptMember}
        onReject={rejectMember}
        onAssignPosition={assignPosition}
      />

      {!loading && (
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredMembers.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">
            {members.length}
          </span>{" "}
          members
        </p>
      )}

      {selectedMember && (
        <MemberDrawer
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
            onEdit={() => {
                setEditingMember(selectedMember);
                setSelectedMember(null);
                setShowMemberModal(true);
            }}
            />
      )}

        <MemberFormModal
            open={showMemberModal}
            onClose={() => {
                setShowMemberModal(false);
                setEditingMember(null);
            }}
            member={editingMember}
            onSuccess={handleMemberSuccess}
        />

        <MemberImportModal
            open={showImportModal}
            onClose={() => setShowImportModal(false)}
            onSuccess={loadData}
        />

    </div>
  );
}