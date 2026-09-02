import Link from "next/link";
import { Upload, UserPlus } from "lucide-react";

export default function MembersHeader({ onAddMember, onImportMembers }) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      
      {/* Page title */}
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-rotaract">
          Membership
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Members
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
          Manage Rotaract Lagos Prime members, applications, positions,
          and membership status.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">

        {/* Import old members */}
        <button
          type="button"
          onClick={onImportMembers}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
        >
          <Upload size={18} strokeWidth={2} />

          IMPORT OLD MEMBERS
        </button>

        {/* Onboard new member */}
        <button
          type="button"
          onClick={onAddMember}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-rotaract px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-rotaract-dark hover:shadow-md"
        >
          <UserPlus
            size={18}
            strokeWidth={2}
          />

          ONBOARD NEW MEMBER
        </button>

      </div>
    </div>
  );
}