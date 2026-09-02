"use client";

import { useState } from "react";
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

const EXPECTED_HEADERS = [
  "Timestamp",
  "Name",
  "Gender",
  "Phone number",
  "Email",
  "DOB",
  "Address",
  "Occupation",
];

export default function MemberImportModal({
  open,
  onClose,
  onSuccess,
}) {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);

  if (!open) return null;

  // ========================================
  // Close / reset
  // ========================================

  function handleClose() {
    if (importing) return;

    setFile(null);
    setRows([]);
    setError("");
    onClose();
  }

  // ========================================
  // Parse CSV
  // ========================================

  function parseCSV(text) {
    const lines = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"') {
        if (insideQuotes && next === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }

        continue;
      }

      if (char === "," && !insideQuotes) {
        lines.push(current);
        current = "";
        continue;
      }

      if (
        (char === "\n" || char === "\r") &&
        !insideQuotes
      ) {
        if (char === "\r" && next === "\n") {
          i++;
        }

        lines.push(current);
        current = "";
        continue;
      }

      current += char;
    }

    if (current.length > 0) {
      lines.push(current);
    }

    return lines;
  }

  // ========================================
  // Convert CSV text into objects
  // ========================================

  function parseCSVRows(text) {
    const rawRows = [];
    let row = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"') {
        if (insideQuotes && next === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }

        continue;
      }

      if (char === "," && !insideQuotes) {
        row.push(current.trim());
        current = "";
        continue;
      }

      if (
        (char === "\n" || char === "\r") &&
        !insideQuotes
      ) {
        if (char === "\r" && next === "\n") {
          i++;
        }

        row.push(current.trim());
        current = "";

        if (row.some((value) => value !== "")) {
          rawRows.push(row);
        }

        row = [];
        continue;
      }

      current += char;
    }

    if (current !== "" || row.length > 0) {
      row.push(current.trim());

      if (row.some((value) => value !== "")) {
        rawRows.push(row);
      }
    }

    if (rawRows.length < 2) {
      throw new Error("The CSV file does not contain any member records.");
    }

    const headers = rawRows[0].map((header) =>
      header.replace(/^\uFEFF/, "").trim()
    );

    const missingHeaders = EXPECTED_HEADERS.filter(
      (header) => !headers.includes(header)
    );

    if (missingHeaders.length > 0) {
      throw new Error(
        `Invalid CSV format. Missing: ${missingHeaders.join(", ")}`
      );
    }

    const dataRows = rawRows.slice(1);

    return dataRows.map((values, index) => {
      const record = {};

      headers.forEach((header, columnIndex) => {
        record[header] = values[columnIndex] || "";
      });

      return {
        ...record,
        _rowNumber: index + 2,
      };
    });
  }

  // ========================================
  // Handle file
  // ========================================

  async function handleFileChange(e) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setError("");
    setRows([]);
    setFile(null);

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a CSV file.");
      return;
    }

    try {
      const text = await selectedFile.text();

      const parsedRows = parseCSVRows(text);

      // Basic validation
      const invalidRows = parsedRows.filter(
        (row) =>
          !row.Name?.trim() ||
          !row.Email?.trim()
      );

      if (invalidRows.length > 0) {
        throw new Error(
          `${invalidRows.length} row(s) are missing a name or email address.`
        );
      }

      setFile(selectedFile);
      setRows(parsedRows);
    } catch (error) {
      console.error("CSV PARSE ERROR:", error);
      setError(
        error.message || "Unable to read the CSV file."
      );
    }
  }

  // ========================================
  // Split name
  // ========================================

  function splitName(fullName) {
    const parts = fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 1) {
      return {
        firstname: parts[0],
        lastname: "",
      };
    }

    return {
      firstname: parts.slice(0, -1).join(" "),
      lastname: parts[parts.length - 1],
    };
  }

  // ========================================
  // Normalize DOB
  // ========================================

  function normalizeDate(value) {
    if (!value) return "";

    const trimmed = value.trim();

    // Already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }

    // Try browser date parsing
    const date = new Date(trimmed);

    if (!Number.isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(
        date.getMonth() + 1
      ).padStart(2, "0");
      const day = String(
        date.getDate()
      ).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    return trimmed;
  }

  // ========================================
  // Prepare members
  // ========================================

  function prepareMembers() {
    return rows.map((row) => {
      const { firstname, lastname } =
        splitName(row.Name);

      return {
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        gender: row.Gender?.trim() || "",
        phone: row["Phone number"]?.trim() || "",
        email: row.Email?.trim().toLowerCase() || "",
        dob: normalizeDate(row.DOB),
        address: row.Address?.trim() || "",
        occupation: row.Occupation?.trim() || "",
      };
    });
  }

  // ========================================
  // Import
  // ========================================

  async function handleImport() {
    if (!rows.length) {
      setError("Please select a CSV file first.");
      return;
    }

    setImporting(true);
    setError("");

    try {
      const members = prepareMembers();

      const response = await fetch(
        "/api/admin/members/import",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            members,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to import members."
        );
      }

      toast.success(
        `${result.imported || members.length} members imported successfully.`
      );

      setFile(null);
      setRows([]);

      if (onSuccess) {
        await onSuccess(result);
      }

      onClose();
    } catch (error) {
      console.error(
        "MEMBER IMPORT ERROR:",
        error
      );

      setError(
        error.message ||
          "Unable to import members."
      );
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="
          relative z-10
          flex w-full max-w-4xl
          max-h-[90vh]
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="shrink-0 border-b border-gray-200 px-5 py-4 sm:px-6">

          <div className="flex items-start justify-between gap-4">

            <div className="flex items-start gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rotaract/10 text-rotaract">
                <FileSpreadsheet size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Import Old Members
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Import your existing members from a CSV file.
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={importing}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900 disabled:opacity-50"
              aria-label="Close import modal"
            >
              <X size={18} />
            </button>

          </div>

        </div>


        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">

          {/* Upload area */}
          {!file && (

            <label
              htmlFor="member-csv"
              className="
                flex cursor-pointer
                flex-col items-center
                justify-center
                rounded-2xl
                border-2 border-dashed
                border-gray-200
                bg-gray-50
                px-6 py-12
                text-center
                transition
                hover:border-rotaract/40
                hover:bg-rotaract/5
              "
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rotaract/10 text-rotaract">
                <Upload size={25} />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                Select your CSV file
              </h3>

              <p className="mt-1 max-w-md text-sm text-gray-500">
                Choose the old member contact information CSV
                to preview the members before importing them.
              </p>

              <span className="mt-5 rounded-full bg-rotaract px-5 py-2.5 text-sm font-bold text-white">
                CHOOSE CSV FILE
              </span>

              <input
                id="member-csv"
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />

            </label>

          )}


          {/* File selected */}
          {file && (

            <div className="space-y-5">

              {/* File information */}
              <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
                    <CheckCircle2 size={20} />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-gray-900">
                      {file.name}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      {rows.length} member
                      {rows.length === 1 ? "" : "s"} found
                    </p>

                  </div>

                </div>

                <label
                  htmlFor="member-csv-replace"
                  className="cursor-pointer text-sm font-semibold text-rotaract hover:underline"
                >
                  Choose another
                  <input
                    id="member-csv-replace"
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

              </div>


              {/* Preview */}
              <div>

                <div className="mb-3 flex items-center justify-between">

                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Import Preview
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      These members will be added as accepted members.
                    </p>
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    {rows.length} records
                  </span>

                </div>


                <div className="overflow-hidden rounded-xl border border-gray-200">

                  <div className="max-h-[380px] overflow-auto">

                    <table className="w-full min-w-[850px] text-left">

                      <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50">

                        <tr>

                          <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                            Name
                          </th>

                          <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                            Gender
                          </th>

                          <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                            Phone
                          </th>

                          <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                            Email
                          </th>

                          <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                            DOB
                          </th>

                          <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                            Occupation
                          </th>

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-gray-100">

                        {rows.map((row) => (

                          <tr
                            key={row._rowNumber}
                            className="hover:bg-gray-50"
                          >

                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {row.Name || "—"}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-600">
                              {row.Gender || "—"}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-600">
                              {row["Phone number"] || "—"}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-600">
                              {row.Email || "—"}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-600">
                              {row.DOB || "—"}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-600">
                              {row.Occupation || "—"}
                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                </div>

              </div>

            </div>

          )}


          {/* Error */}
          {error && (

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>

            </div>

          )}

        </div>


        {/* Footer */}
        <div className="shrink-0 border-t border-gray-200 bg-white p-4 sm:p-5">

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={handleClose}
              disabled={importing}
              className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              CANCEL
            </button>

            <button
              type="button"
              onClick={handleImport}
              disabled={!file || !rows.length || importing}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-rotaract px-6 py-3 text-sm font-bold text-white transition hover:bg-rotaract-dark disabled:cursor-not-allowed disabled:opacity-50"
            >

              {importing ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  IMPORTING...
                </>
              ) : (
                <>
                  <Upload size={17} />

                  IMPORT {rows.length || ""} MEMBERS
                </>
              )}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}