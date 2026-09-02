"use client";

import { useEffect, useState } from "react";
import {
  X,
  Pencil,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CalendarDays,
  User,
  ShieldCheck,
  Save,
  ArrowLeft,
} from "lucide-react";

import StatusBadge from "./StatusBadge";

export default function MemberDrawer({
  member,
  onClose,
  onEdit,
  onSave,
  saving = false,
}) {
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    phone: "",
    email: "",
    dob: "",
    address: "",
    occupation: "",
  });

  useEffect(() => {
    if (!member) return;

    setFormData({
      firstname: member.firstname || "",
      lastname: member.lastname || "",
      gender: member.gender || "",
      phone: member.phone || "",
      email: member.email || "",
      dob: member.dob || "",
      address: member.address || "",
      occupation: member.occupation || "",
    });
  }, [member]);

  if (!member) return null;

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleEdit() {
    setEditing(true);

    if (onEdit) {
      onEdit(member);
    }
  }

  function resetForm() {
    setFormData({
      firstname: member.firstname || "",
      lastname: member.lastname || "",
      gender: member.gender || "",
      phone: member.phone || "",
      email: member.email || "",
      dob: member.dob || "",
      address: member.address || "",
      occupation: member.occupation || "",
    });
  }

  function handleCancelEdit() {
    resetForm();
    setEditing(false);
  }

  async function handleSave(e) {
    e.preventDefault();

    if (!onSave) return;

    await onSave(member.id, {
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      gender: formData.gender,
      phone: formData.phone.trim(),
      email: formData.email.trim().toLowerCase(),
      dob: formData.dob,
      address: formData.address.trim(),
      occupation: formData.occupation.trim(),
    });

    setEditing(false);
  }

  return (
    <div className="fixed inset-0 z-50">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className="
          absolute right-0 top-0
          flex h-full w-full max-w-xl
          flex-col
          bg-white
          shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >

        {/* ========================================
            Header
        ======================================== */}
        <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">

          <div className="flex items-center justify-between gap-4">

            <div className="flex min-w-0 items-center gap-3">

              {editing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900 disabled:opacity-50"
                  aria-label="Cancel editing"
                >
                  <ArrowLeft size={18} />
                </button>
              )}

              <div className="min-w-0">

                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-rotaract">
                  {editing ? "Edit Member" : "Member Profile"}
                </p>

                <h2 className="mt-1 truncate text-lg font-bold text-gray-900 sm:text-xl">
                  {member.firstname} {member.lastname}
                </h2>

              </div>

            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close member details"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
            >
              <X size={18} />
            </button>

          </div>

        </div>


        {/* ========================================
            Content
        ======================================== */}
        <div
          className="
            flex-1
            overflow-y-auto
            lg:overflow-y-hidden
          "
        >

          {editing ? (

            /* ====================================
               EDIT FORM
            ==================================== */
            <form
              id="member-edit-form"
              onSubmit={handleSave}
              className="p-4 sm:p-6"
            >

              {/* Profile */}
              <div className="mb-5 rounded-2xl bg-gray-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rotaract/10 text-base font-bold text-rotaract">
                    {(formData.firstname?.[0] || "").toUpperCase()}
                    {(formData.lastname?.[0] || "").toUpperCase()}
                  </div>

                  <div className="min-w-0">

                    <p className="font-semibold text-gray-900">
                      Edit member information
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Update the details below and save your changes.
                    </p>

                  </div>

                </div>

              </div>


              {/* ==================================
                  Personal Information
              ================================== */}
              <section className="mb-6">

                <SectionTitle
                  icon={<User size={16} />}
                  title="Personal Information"
                />

                <div className="grid gap-4 sm:grid-cols-2">

                  <Input
                    label="First Name"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Last Name"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                  />

                  <Select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    options={[
                      "Male",
                      "Female",
                      "Prefer not to say",
                    ]}
                  />

                  <Input
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />

                </div>

              </section>


              {/* ==================================
                  Contact Information
              ================================== */}
              <section className="mb-6">

                <SectionTitle
                  icon={<Phone size={16} />}
                  title="Contact Information"
                />

                <div className="grid gap-4 sm:grid-cols-2">

                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <div className="sm:col-span-2">

                    <TextArea
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

              </section>


              {/* ==================================
                  Membership Information
              ================================== */}
              <section>

                <SectionTitle
                  icon={<ShieldCheck size={16} />}
                  title="Membership Information"
                />

                <div className="grid gap-4 sm:grid-cols-2">

                  <Input
                    label="Occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    required
                  />

                  <div>

                    <label className="mb-2 block text-xs font-semibold text-gray-600">
                      Current Position
                    </label>

                    <div className="flex h-[46px] items-center rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-500">
                      {member.position?.name || "No position"}
                    </div>

                  </div>

                </div>

              </section>

            </form>

          ) : (

            /* ====================================
               VIEW MODE
            ==================================== */
            <div className="space-y-7 p-4 sm:p-6">

              {/* Profile */}
              <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-5">

                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-rotaract/5" />

                <div className="relative flex items-center gap-4">

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-rotaract/10 text-xl font-bold text-rotaract">
                    {(member.firstname?.[0] || "").toUpperCase()}
                    {(member.lastname?.[0] || "").toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">

                    <h3 className="truncate text-lg font-bold text-gray-900">
                      {member.firstname} {member.lastname}
                    </h3>

                    <p className="mt-1 truncate text-sm text-gray-500">
                      {member.email || "No email provided"}
                    </p>

                    <div className="mt-3">
                      <StatusBadge status={member.status} />
                    </div>

                  </div>

                </div>

              </div>


              {/* Personal */}
              <section>

                <SectionTitle
                  icon={<User size={17} />}
                  title="Personal Information"
                />

                <div className="grid gap-5 sm:grid-cols-2">

                  <Detail
                    label="First Name"
                    value={member.firstname}
                  />

                  <Detail
                    label="Last Name"
                    value={member.lastname}
                  />

                  <Detail
                    label="Gender"
                    value={member.gender}
                  />

                  <Detail
                    label="Date of Birth"
                    value={member.dob}
                    icon={<CalendarDays size={15} />}
                  />

                </div>

              </section>


              {/* Contact */}
              <section>

                <SectionTitle
                  icon={<Phone size={17} />}
                  title="Contact Information"
                />

                <div className="space-y-4">

                  <Detail
                    label="Phone Number"
                    value={member.phone}
                    icon={<Phone size={15} />}
                  />

                  <Detail
                    label="Email Address"
                    value={member.email}
                    icon={<Mail size={15} />}
                  />

                  <Detail
                    label="Address"
                    value={member.address}
                    icon={<MapPin size={15} />}
                  />

                </div>

              </section>


              {/* Membership */}
              <section>

                <SectionTitle
                  icon={<ShieldCheck size={17} />}
                  title="Membership Information"
                />

                <div className="grid gap-5 sm:grid-cols-2">

                  <Detail
                    label="Occupation"
                    value={member.occupation}
                    icon={<Briefcase size={15} />}
                  />

                  <Detail
                    label="Position"
                    value={member.position?.name || "No position"}
                  />

                  <Detail
                    label="Status"
                    value={
                      <StatusBadge status={member.status} />
                    }
                  />

                </div>

              </section>

            </div>

          )}

        </div>


        {/* ========================================
            Footer
        ======================================== */}
        <div className="shrink-0 border-t border-gray-200 bg-white p-4 sm:p-5">

          {editing ? (

            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
                className="order-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 sm:order-1"
              >
                CANCEL
              </button>

              <button
                type="submit"
                form="member-edit-form"
                disabled={saving}
                className="order-1 inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-rotaract px-5 py-3 text-sm font-bold text-white transition hover:bg-rotaract-dark disabled:cursor-not-allowed disabled:opacity-60 sm:order-2"
              >
                <Save size={16} />

                {saving ? "SAVING..." : "SAVE CHANGES"}
              </button>

            </div>

          ) : (

            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-rotaract px-5 py-3 text-sm font-bold text-white transition hover:bg-rotaract-dark"
              >
                <Pencil size={16} />

                EDIT MEMBER
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                CLOSE
              </button>

            </div>

          )}

        </div>

      </aside>

    </div>
  );
}


/* ========================================
   Section Title
======================================== */

function SectionTitle({ icon, title }) {
  return (
    <div className="mb-3 flex items-center gap-2">

      <span className="text-rotaract">
        {icon}
      </span>

      <h3 className="text-sm font-bold text-gray-900">
        {title}
      </h3>

    </div>
  );
}


/* ========================================
   Detail
======================================== */

function Detail({
  label,
  value,
  icon,
}) {
  return (
    <div className="min-w-0">

      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <div className="mt-1 flex items-start gap-2 text-sm text-gray-900">

        {icon && (
          <span className="mt-0.5 shrink-0 text-gray-400">
            {icon}
          </span>
        )}

        <span className="break-words">
          {value || "—"}
        </span>

      </div>

    </div>
  );
}


/* ========================================
   Input
======================================== */

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-semibold text-gray-600"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="h-[46px] w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rotaract focus:bg-white focus:ring-2 focus:ring-rotaract/10"
      />

    </div>
  );
}


/* ========================================
   Select
======================================== */

function Select({
  label,
  name,
  value,
  onChange,
  required,
  options,
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-semibold text-gray-600"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="h-[46px] w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition focus:border-rotaract focus:bg-white focus:ring-2 focus:ring-rotaract/10"
      >

        <option value="">
          Select gender
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}


/* ========================================
   Textarea
======================================== */

function TextArea({
  label,
  name,
  value,
  onChange,
  required,
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-semibold text-gray-600"
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={3}
        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rotaract focus:bg-white focus:ring-2 focus:ring-rotaract/10"
      />

    </div>
  );
}