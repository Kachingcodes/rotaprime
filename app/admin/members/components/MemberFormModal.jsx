"use client";

import { useEffect, useState } from "react";
import { X, UserPlus, Pencil } from "lucide-react";
import { toast } from "react-toastify";

export default function MemberFormModal({
  open,
  onClose,
  member = null,
  onSuccess,
}) {
  const isEditing = Boolean(member);

  const emptyForm = {
    lastname: "",
    firstname: "",
    gender: "",
    phone: "",
    email: "",
    dob: "",
    address: "",
    occupation: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  // ========================================
  // Populate form when editing
  // ========================================

  useEffect(() => {
    if (!open) return;

    if (member) {
      setFormData({
        lastname: member.lastname || "",
        firstname: member.firstname || "",
        gender: member.gender || "",
        phone: member.phone || "",
        email: member.email || "",
        dob: member.dob || "",
        address: member.address || "",
        occupation: member.occupation || "",
      });
    } else {
      setFormData(emptyForm);
    }
  }, [open, member]);

  // ========================================
  // Close with Escape key
  // ========================================

  useEffect(() => {
    if (!open) return;

    function handleEscape(e) {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, loading, onClose]);

  // ========================================
  // Handle input changes
  // ========================================

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // ========================================
  // Submit
  // ========================================

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const url = isEditing
        ? `/api/admin/members/${member.id}`
        : "/api/admin/members";

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            (isEditing
              ? "Unable to update member."
              : "Unable to create member.")
        );
      }

      // ========================================
      // Toast
      // ========================================

      toast.success(
        isEditing
          ? "Member updated successfully!"
          : "Member added successfully!"
      );

      // ========================================
      // Tell MembersPage about the change
      // ========================================

      if (onSuccess) {
        onSuccess(result);
      }

      // Close modal
      onClose();

      // Reset form
      setFormData(emptyForm);
    } catch (error) {
      console.error("ADMIN MEMBER FORM ERROR:", error);

      toast.error(
        error.message ||
          (isEditing
            ? "Unable to update member. Please try again."
            : "Unable to add member. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // Don't render when closed
  // ========================================

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">

      {/* ==================================
          Backdrop
      ================================== */}

      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => {
          if (!loading) onClose();
        }}
      />

      {/* ==================================
          Modal
      ================================== */}

      <div
        className="relative flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[100vh] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ==================================
            Header
        ================================== */}

        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-7 sm:py-5">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rotaract/10 text-rotaract">
              {isEditing ? (
                <Pencil size={19} />
              ) : (
                <UserPlus size={19} />
              )}
            </div>

            <div className="min-w-0">

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-rotaract">
                Membership
              </p>

              <h2 className="mt-0.5 truncate text-lg font-bold text-gray-900 sm:text-xl">
                {isEditing ? "Edit Member" : "Add New Member"}
              </h2>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close member form"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>

        </div>


        {/* ==================================
            Form Content
        ================================== */}

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >

          <div className="flex-1 overflow-y-auto">

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:gap-6 sm:p-7">

              {/* ==================================
                  Last Name
              ================================== */}

              <div>
                <label
                  htmlFor="member-lastname"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Last Name
                </label>

                <input
                  id="member-lastname"
                  name="lastname"
                  type="text"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  placeholder="Last name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rotaract focus:bg-white focus:ring-2 focus:ring-rotaract/10"
                />
              </div>


              {/* ==================================
                  First Name
              ================================== */}

              <div>
                <label
                  htmlFor="member-firstname"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  First Name
                </label>

                <input
                  id="member-firstname"
                  name="firstname"
                  type="text"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  placeholder="First name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rotaract focus:bg-white focus:ring-2 focus:ring-rotaract/10"
                />
              </div>


              {/* ==================================
                  Gender
              ================================== */}

              <div>
                <label
                  htmlFor="member-gender"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Gender
                </label>

                <select
                  id="member-gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-rotaract focus:bg-white focus:ring-2 focus:ring-rotaract/10"
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>
                </select>
              </div>


              {/* ==================================
                  Phone
              ================================== */}

              <div>
                <label
                  htmlFor="member-phone"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Phone Number
                </label>

                <input
                  id="member-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="08012345678"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rotaract focus:bg-white focus:ring-2 focus:ring-rotaract/10"
                />
              </div>


              {/* ==================================
                  Email
              ================================== */}

              <div className="sm:col-span-2">

                <label
                  htmlFor="member-email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>

                <input
                  id="member-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="member@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rotaract focus:bg-white focus:ring-2 focus:ring-rotaract/10"
                />

              </div>


              {/* ==================================
                  Date of Birth
              ================================== */}

              <div>
                <label
                  htmlFor="member-dob"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Date of Birth
                </label>

                <input
                  id="member-dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-rotaract focus:bg-white focus:ring-2 focus:ring-rotaract/10"
                />
              </div>


              {/* ==================================
                  Occupation
              ================================== */}

              <div>
                <label
                  htmlFor="member-occupation"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Occupation
                </label>

                <input
                  id="member-occupation"
                  name="occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Student, Engineer"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rotaract focus:bg-white focus:ring-2 focus:ring-rotaract/10"
                />
              </div>


              {/* ==================================
                  Address
              ================================== */}

              <div className="sm:col-span-2">

                <label
                  htmlFor="member-address"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Address
                </label>

                <textarea
                  id="member-address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Residential address"
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rotaract focus:bg-white focus:ring-2 focus:ring-rotaract/10"
                />

              </div>

            </div>

          </div>


          {/* ==================================
              Footer
          ================================== */}

          <div className="shrink-0 border-t border-gray-200 bg-white px-5 py-4 sm:px-7">

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                CANCEL
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-rotaract px-6 py-3 text-sm font-bold text-white transition hover:bg-rotaract-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading
                  ? isEditing
                    ? "SAVING..."
                    : "ADDING..."
                  : isEditing
                    ? "SAVE CHANGES"
                    : "ADD MEMBER →"}
              </button>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
}