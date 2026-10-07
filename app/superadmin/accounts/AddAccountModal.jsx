"use client";

import { useState, useEffect } from "react";
import {
X,
UserRound,
Mail,
LockKeyhole,
BriefcaseBusiness,
CalendarDays,
Eye,
EyeOff,
} from "lucide-react";
import { toast } from "react-toastify";

export default function AddAccountModal({
account = null,
onClose,
onSuccess,
}) {
const isEditMode = Boolean(account);

const [showPassword, setShowPassword] = useState(false);

const [members, setMembers] = useState([]);
const [positions, setPositions] = useState([]);
const [loadingOptions, setLoadingOptions] = useState(true);
const [submitting, setSubmitting] = useState(false);

const [formData, setFormData] = useState({
memberId: "",
email: "",
password: "",
status: "Active",
positionId: "",
startDate: "",
endDate: "",
termStatus: "Active",
});

useEffect(() => {
if (!account) {
setFormData({
memberId: "",
email: "",
password: "",
status: "Active",
positionId: "",
startDate: "",
endDate: "",
termStatus: "Active",
});

  return;
}

setFormData({
  memberId: account.memberId || "",
  email: account.email || "",
  password: "",
  status: account.status || "Active",
  positionId: account.positionId || "",
  startDate: account.startDate || "",
  endDate: account.endDate || "",
  termStatus: account.termStatus || "Active",
});

}, [account]);

useEffect(() => {
async function loadOptions() {
try {
setLoadingOptions(true);

    const response = await fetch(
      "/api/superadmin/accounts/options"
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to load account options."
      );
    }

    setMembers(data.members || []);
    setPositions(data.positions || []);
  } catch (error) {
    console.error("Load account options error:", error);

    toast.error(
      error.message || "Unable to load account options."
    );
  } finally {
    setLoadingOptions(false);
  }
}

loadOptions();

}, []);

function handleChange(event) {
const { name, value } = event.target;


setFormData((current) => ({
  ...current,
  [name]: value,
}));

}

async function handleSubmit(event) {
event.preventDefault();

try {
  setSubmitting(true);

  const url = isEditMode
    ? `/api/superadmin/accounts/${account.id}`
    : "/api/superadmin/accounts";

  const method = isEditMode ? "PATCH" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    toast.error(
      data.error ||
        (isEditMode
          ? "Unable to update account."
          : "Unable to create account.")
    );

    return;
  }

  toast.success(
    isEditMode
      ? "Account updated successfully."
      : "Account created successfully."
  );

  onSuccess?.();
  onClose();
} catch (error) {
  console.error(
    isEditMode
      ? "Update account error:"
      : "Create account error:",
    error
  );

  toast.error(
    isEditMode
      ? "Something went wrong while updating the account."
      : "Something went wrong while creating the account."
  );
} finally {
  setSubmitting(false);
}

}

    return ( 
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"> <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */} 
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5"> <div> <div className="flex items-center gap-3"> <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fce1ec] text-[#d41367]"> <UserRound size={20} /> </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditMode ? "Edit Account" : "Add Account"}
            </h2>

            <p className="mt-0.5 text-sm text-gray-500">
              {isEditMode
                ? "Update this user's account and board appointment."
                : "Onboard a member and assign their board appointment."}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        aria-label="Close"
      >
        <X size={19} />
      </button>
    </div>

    {/* Form */}
    <form
      onSubmit={handleSubmit}
      className="overflow-y-auto px-6 py-6 hide-scrollbar"
    >
      {/* Account Information */}
      <div>
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-gray-900">
            Account Information
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {isEditMode
              ? "Update the user's login account details."
              : "These details are used to create the member's login account."}
          </p>
        </div>

        <div className="space-y-5">
          {/* Member */}
          <div>
            <label
              htmlFor="memberId"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Member
            </label>

            <div className="relative">
              <UserRound
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                id="memberId"
                name="memberId"
                value={formData.memberId}
                onChange={handleChange}
                required
                disabled={loadingOptions}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-8 text-sm outline-none transition focus:border-[var(--cranberry)]"
              >
                <option value="">
                  {loadingOptions
                    ? "Loading members..."
                    : "Select member"}
                </option>

                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.firstname} {member.lastname}
                    {member.email ? ` — ${member.email}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <p className="mt-1.5 text-xs text-gray-400">
              Select an existing member. A new member will not be created.
            </p>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <div className="relative">
              <Mail
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter login email"
                required
                autoComplete="off"
                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#d41367] focus:ring-1 focus:ring-[#d41367]"
              />
            </div>
          </div>

          {/* Password */}
          {!isEditMode && (
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Temporary Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter temporary password"
                  required
                  autoComplete="new-password"
                  minLength={8}
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-11 text-sm text-gray-900 outline-none transition focus:border-[#d41367] focus:ring-1 focus:ring-[#d41367]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <p className="mt-1.5 text-xs text-gray-400">
                The member can change this password after signing in.
              </p>
            </div>
          )}

          {/* Account Status */}
          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Account Status
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#d41367] focus:ring-1 focus:ring-[#d41367]"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-8 border-t border-gray-200" />

      {/* Board Appointment */}
      <div>
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-gray-900">
            Board Appointment
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Define the board position and period for this member's access.
          </p>
        </div>

        <div className="space-y-5">
          {/* Position */}
          <div>
            <label
              htmlFor="positionId"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Board Position
            </label>

            <div className="relative">
              <BriefcaseBusiness
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                id="positionId"
                name="positionId"
                value={formData.positionId}
                onChange={handleChange}
                required
                disabled={loadingOptions}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-8 text-sm outline-none transition focus:border-[var(--cranberry)]"
              >
                <option value="">
                  {loadingOptions
                    ? "Loading positions..."
                    : "Select board position"}
                </option>

                {positions.map((position) => (
                  <option key={position.id} value={position.id}>
                    {position.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="startDate"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Term Start Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#d41367] focus:ring-1 focus:ring-[#d41367]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Term End Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#d41367] focus:ring-1 focus:ring-[#d41367]"
                />
              </div>
            </div>
          </div>

          {/* Term Status */}
          <div>
            <label
              htmlFor="termStatus"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Board Term Status
            </label>

            <select
              id="termStatus"
              name="termStatus"
              value={formData.termStatus}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#d41367] focus:ring-1 focus:ring-[#d41367]"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Past">Past</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting || loadingOptions}
          className="rounded-lg bg-[#d41367] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#b91059] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? isEditMode
              ? "Saving..."
              : "Creating..."
            : isEditMode
              ? "Save Changes"
              : "Create Account"}
        </button>
      </div>
    </form>
  </div>
</div>

);
}
