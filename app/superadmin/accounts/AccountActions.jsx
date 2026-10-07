"use client";

import { useEffect, useRef, useState } from "react";
import {
MoreHorizontal,
Pencil,
Power,
Trash2,
X,
AlertTriangle,
} from "lucide-react";

export default function AccountActions({
account,
onEdit,
onStatusChange,
onDelete,
}) {
const [open, setOpen] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteConfirmation, setDeleteConfirmation] = useState("");

const menuRef = useRef(null);

useEffect(() => {
function handleClickOutside(event) {
if (
menuRef.current &&
!menuRef.current.contains(event.target)
) {
setOpen(false);
}
}

if (open) {
  document.addEventListener(
    "mousedown", 
    handleClickOutside);
}

return () => {
  document.removeEventListener(
    "mousedown", 
    handleClickOutside);
};


}, [open]);

function handleDeleteClick() {
setOpen(false);
setDeleteConfirmation("");
setShowDeleteModal(true);
}

function closeDeleteModal() {
setShowDeleteModal(false);
setDeleteConfirmation("");
}

function handleConfirmDelete() {
if (deleteConfirmation !== "DELETE") {
return;
}

onDelete(account);
closeDeleteModal();

}

return (
    <> 
        <div ref={menuRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label={`Actions for ${account.name}`}
                aria-expanded={open}
            > 
                <MoreHorizontal size={19} />
            </button>

            {open && (
            <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                <button
                    type="button"
                    onClick={() => {
                        setOpen(false);
                        onEdit(account);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                >
                    <Pencil size={16} className="text-gray-400" />
                        Edit Account
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setOpen(false);
                        onStatusChange(account);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                >
                    <Power size={16} className="text-gray-400" />
                    {account.status === "Active"
                        ? "Deactivate Account"
                        : "Activate Account"}
                </button>

                <div className="my-1 border-t border-gray-100" />

                    <button
                        type="button"
                        onClick={handleDeleteClick}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                    >
                        <Trash2 size={16} />
                        Delete Account
                    </button>
                </div>
            )}
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
                    
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                                    <AlertTriangle size={20} />
                                </div>
                            <div>
                        
                            <h2 className="text-lg font-semibold text-gray-900">
                                Delete Account
                            </h2>

                            <p className="mt-0.5 text-xs text-gray-500">
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>

                        <button
                            type="button"
                            onClick={closeDeleteModal}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="mt-5">
                        <p className="text-sm leading-6 text-gray-600">
                            You are about to permanently delete the account for{" "}
                            <span className="font-semibold text-gray-900">
                            {account.name}
                            </span>
                            .
                        </p>

                        <p className="mt-3 text-sm text-gray-600">
                            Type{" "}
                            <span className="font-semibold text-gray-900">
                            DELETE
                            </span>{" "}
                            below to confirm.
                        </p>

                        <input
                            type="text"
                            value={deleteConfirmation}
                            onChange={(event) =>
                            setDeleteConfirmation(event.target.value)
                            }
                            placeholder="Type DELETE"
                            className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeDeleteModal}
                            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleConfirmDelete}
                            disabled={deleteConfirmation !== "DELETE"}
                            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
        </div>
  )}
</>

);
}
