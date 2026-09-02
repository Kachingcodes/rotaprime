"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Power,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function SettingsPage() {
  const [positions, setPositions] = useState([]);
  const [positionName, setPositionName] = useState("");

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadPositions();
  }, []);

  async function loadPositions() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/positions");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load positions."
        );
      }

      setPositions(data.positions || []);
    } catch (error) {
      console.error("LOAD POSITIONS ERROR:", error);

      setError(
        error.message || "Unable to load positions."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleAddPosition(e) {
    e.preventDefault();

    const name = positionName.trim();

    if (!name) {
      setError("Please enter a position name.");
      return;
    }

    try {
      setAdding(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        "/api/admin/positions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to add position."
        );
      }

      setPositions((current) => [
        ...current,
        data.position,
      ]);

      setPositionName("");

      setSuccess("Position added successfully.");
    } catch (error) {
      console.error("ADD POSITION ERROR:", error);

      setError(
        error.message || "Unable to add position."
      );
    } finally {
      setAdding(false);
    }
  }

  async function togglePosition(position) {
    try {
      setUpdatingId(position.id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/admin/positions/${position.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            active: !position.active,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update position."
        );
      }

      setPositions((current) =>
        current.map((item) =>
          item.id === position.id
            ? {
                ...item,
                active: !position.active,
              }
            : item
        )
      );

      setSuccess(
        `${position.name} ${
          !position.active
            ? "activated"
            : "deactivated"
        } successfully.`
      );
    } catch (error) {
      console.error(
        "UPDATE POSITION ERROR:",
        error
      );

      setError(
        error.message ||
          "Unable to update position."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="space-y-8">

      {/* ========================================
          Header
      ======================================== */}

      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-rotaract">
          Administration
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Settings
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
          Manage membership positions and other
          administrative settings.
        </p>
      </div>


      {/* ========================================
          Messages
      ======================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}


      {/* ========================================
          Positions
      ======================================== */}

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* Section header */}

        <div className="border-b border-gray-200 px-5 py-5 sm:px-6">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rotaract/10 text-rotaract">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Membership Positions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add positions and control which
                positions are available for assignment.
              </p>
            </div>

          </div>

        </div>


        {/* ========================================
            Add position
        ======================================== */}

        <div className="border-b border-gray-200 bg-gray-50/70 p-5 sm:p-6">

          <form
            onSubmit={handleAddPosition}
            className="flex flex-col gap-3 sm:flex-row"
          >

            <input
              type="text"
              value={positionName}
              onChange={(e) =>
                setPositionName(e.target.value)
              }
              placeholder="e.g. President"
              disabled={adding}
              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rotaract focus:ring-2 focus:ring-rotaract/10 disabled:opacity-60"
            />

            <button
                type="submit"
                disabled={adding}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-rotaract px-6 py-3 text-sm font-bold text-white transition hover:bg-rotaract-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                {adding ? (
                    <Loader2
                    size={17}
                    className="animate-spin"
                    />
                ) : (
                    <Plus size={17} />
                )}

                {adding ? "ADDING..." : "ADD POSITION"}
            </button>

          </form>

        </div>


        {/* ========================================
            Position list
        ======================================== */}

        <div className="divide-y divide-gray-100">

          {loading ? (

            <div className="flex min-h-[180px] items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Loading positions...
              </div>
            </div>

          ) : positions.length === 0 ? (

            <div className="px-6 py-12 text-center">

              <p className="font-semibold text-gray-900">
                No positions yet
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add your first membership position
                above.
              </p>

            </div>

          ) : (

            positions.map((position) => (

              <div
                key={position.id}
                className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >

                {/* Position info */}

                <div className="min-w-0">

                  <p className="font-semibold text-gray-900">
                    {position.name}
                  </p>

                  <p
                    className={`mt-1 text-xs font-semibold ${
                      position.active
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    {position.active
                      ? "Active"
                      : "Inactive"}
                  </p>

                </div>


                {/* Toggle */}

                <button
                  type="button"
                  onClick={() =>
                    togglePosition(position)
                  }
                  disabled={
                    updatingId === position.id
                  }
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    position.active
                      ? "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      : "bg-rotaract text-white hover:bg-rotaract-dark"
                  }`}
                >

                  {updatingId === position.id ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <Power size={16} />
                  )}

                  {position.active
                    ? "DEACTIVATE"
                    : "ACTIVATE"}

                </button>

              </div>

            ))

          )}

        </div>

      </section>

    </main>
  );
}