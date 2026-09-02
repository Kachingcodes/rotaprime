"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Mail,
  MailOpen,
  Search,
  CheckCheck,
  Clock,
  MessageCircle,
  X,
  Phone,
  User,
  CalendarDays,
  Loader2,
} from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/messages");

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("The server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load messages."
        );
      }

      setMessages(data.messages || []);
    } catch (error) {
      console.error("LOAD MESSAGES ERROR:", error);

      setError(
        error.message || "Unable to load messages."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateMessageStatus(message, status) {
    try {
      setSavingId(message.id);
      setError("");

      const response = await fetch(
        `/api/admin/messages/${message.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update message."
        );
      }

      setMessages((current) =>
        current.map((item) =>
          item.id === message.id
            ? {
                ...item,
                status,
              }
            : item
        )
      );

      setSelectedMessage((current) =>
        current?.id === message.id
          ? {
              ...current,
              status,
            }
          : current
      );
    } catch (error) {
      console.error(
        "UPDATE MESSAGE ERROR:",
        error
      );

      setError(
        error.message ||
          "Unable to update message."
      );
    } finally {
      setSavingId(null);
    }
  }

  const filteredMessages = useMemo(() => {
    const searchTerm = search
      .toLowerCase()
      .trim();

    return messages.filter((message) => {
      const matchesFilter =
        filter === "all" ||
        message.status === filter;

      if (!matchesFilter) return false;

      if (!searchTerm) return true;

      return (
        `${message.name || ""}`
          .toLowerCase()
          .includes(searchTerm) ||
        `${message.email || ""}`
          .toLowerCase()
          .includes(searchTerm) ||
        `${message.phone || ""}`
          .toLowerCase()
          .includes(searchTerm) ||
        `${message.message || ""}`
          .toLowerCase()
          .includes(searchTerm)
      );
    });
  }, [messages, search, filter]);

  const unreadCount = messages.filter(
    (message) => message.status === "unread"
  ).length;

  const readCount = messages.filter(
    (message) => message.status === "read"
  ).length;

  const repliedCount = messages.filter(
    (message) => message.status === "replied"
  ).length;

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  return (
    <main className="space-y-6">

      {/* ========================================
          Header
      ======================================== */}

      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-rotaract">
          Communication
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Messages
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
          View enquiries and messages submitted
          through the website.
        </p>
      </div>


      {/* ========================================
          Error
      ======================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}


      {/* ========================================
          Stats
      ======================================== */}

      <div className="grid gap-4 sm:grid-cols-3">

        <StatCard
          icon={<Mail size={18} />}
          label="Unread"
          value={unreadCount}
        />

        <StatCard
          icon={<MailOpen size={18} />}
          label="Read"
          value={readCount}
        />

        <StatCard
          icon={<CheckCheck size={18} />}
          label="Replied"
          value={repliedCount}
        />

      </div>


      {/* ========================================
          Search + Filters
      ======================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 lg:flex-row">

          {/* Search */}

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search messages..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-rotaract focus:bg-white"
            />

          </div>


          {/* Filters */}

          <div className="flex flex-wrap gap-2">

            <FilterButton
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All
            </FilterButton>

            <FilterButton
              active={filter === "unread"}
              onClick={() => setFilter("unread")}
            >
              Unread
            </FilterButton>

            <FilterButton
              active={filter === "read"}
              onClick={() => setFilter("read")}
            >
              Read
            </FilterButton>

            <FilterButton
              active={filter === "replied"}
              onClick={() => setFilter("replied")}
            >
              Replied
            </FilterButton>

          </div>

        </div>

      </div>


      {/* ========================================
          Messages
      ======================================== */}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {loading ? (

          <div className="flex min-h-[300px] items-center justify-center">

            <div className="flex items-center gap-2 text-sm text-gray-500">

              <Loader2
                size={18}
                className="animate-spin"
              />

              Loading messages...

            </div>

          </div>

        ) : filteredMessages.length === 0 ? (

          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <MessageCircle size={25} />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No messages found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Messages submitted through the
              website will appear here.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-gray-100">

            {filteredMessages.map((message) => (

              <button
                key={message.id}
                type="button"
                onClick={() => {
                  setSelectedMessage(message);

                  if (
                    message.status ===
                    "unread"
                  ) {
                    updateMessageStatus(
                      message,
                      "read"
                    );
                  }
                }}
                className={`flex w-full flex-col gap-4 px-5 py-5 text-left transition hover:bg-gray-50 sm:px-6 ${
                  message.status === "unread"
                    ? "bg-rotaract/[0.03]"
                    : "bg-white"
                }`}
              >

                <div className="flex items-start gap-4">

                  {/* Avatar */}

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rotaract/10 text-sm font-bold text-rotaract">
                    {(message.name?.[0] || "M")
                      .toUpperCase()}
                  </div>


                  {/* Main */}

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-center gap-2">

                        <h3
                          className={`truncate text-sm ${
                            message.status ===
                            "unread"
                              ? "font-bold text-gray-900"
                              : "font-semibold text-gray-800"
                          }`}
                        >
                          {message.name ||
                            "Unknown sender"}
                        </h3>

                        {message.status ===
                          "unread" && (
                          <span className="h-2 w-2 rounded-full bg-rotaract" />
                        )}

                      </div>

                      <span className="shrink-0 text-xs text-gray-400">
                        {formatDate(
                          message.createdAt
                        )}
                      </span>

                    </div>


                    <p className="mt-1 truncate text-sm text-gray-500">
                      {message.email}
                    </p>


                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                      {message.message}
                    </p>


                    <div className="mt-3">
                      <MessageStatus
                        status={message.status}
                      />
                    </div>

                  </div>

                </div>

              </button>

            ))}

          </div>

        )}

      </section>


      {!loading && (
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredMessages.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">
            {messages.length}
          </span>{" "}
          messages
        </p>
      )}


      {/* ========================================
          Message Drawer
      ======================================== */}

      {selectedMessage && (
        <MessageDrawer
          message={selectedMessage}
          saving={savingId === selectedMessage.id}
          onClose={() =>
            setSelectedMessage(null)
          }
          onMarkRead={() =>
            updateMessageStatus(
              selectedMessage,
              "read"
            )
          }
          onMarkReplied={() =>
            updateMessageStatus(
              selectedMessage,
              "replied"
            )
          }
        />
      )}

    </main>
  );
}


/* ========================================
   STAT CARD
======================================== */

function StatCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rotaract/10 text-rotaract">
          {icon}
        </div>

        <div>

          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}


/* ========================================
   FILTER BUTTON
======================================== */

function FilterButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-bold transition ${
        active
          ? "bg-rotaract text-white"
          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}


/* ========================================
   MESSAGE STATUS
======================================== */

function MessageStatus({ status }) {
  if (status === "replied") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
        <CheckCheck size={13} />
        Replied
      </span>
    );
  }

  if (status === "read") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
        <MailOpen size={13} />
        Read
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
      <Clock size={13} />
      Unread
    </span>
  );
}


/* ========================================
   MESSAGE DRAWER
======================================== */

function MessageDrawer({
  message,
  saving,
  onClose,
  onMarkRead,
  onMarkReplied,
}) {
  return (
    <div className="fixed inset-0 z-50">

      {/* Backdrop */}

      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />


      {/* Drawer */}

      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* Header */}

        <div className="shrink-0 border-b border-gray-200 px-5 py-5">

          <div className="flex items-center justify-between gap-4">

            <div className="min-w-0">

              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-rotaract">
                Message
              </p>

              <h2 className="mt-1 truncate text-xl font-bold text-gray-900">
                {message.name}
              </h2>

            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
            >
              <X size={18} />
            </button>

          </div>

        </div>


        {/* Content */}

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">

          {/* Sender */}

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

            <div className="grid gap-4 sm:grid-cols-2">

              <Detail
                icon={<User size={15} />}
                label="Name"
                value={message.name}
              />

              <Detail
                icon={<Phone size={15} />}
                label="Phone"
                value={message.phone}
              />

              <Detail
                icon={<Mail size={15} />}
                label="Email"
                value={message.email}
              />

              <Detail
                icon={<CalendarDays size={15} />}
                label="Date"
                value={formatMessageDate(
                  message.createdAt
                )}
              />

            </div>

          </div>


          {/* Status */}

          <div className="mt-6">

            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Status
            </p>

            <div className="mt-2">
              <MessageStatus
                status={message.status}
              />
            </div>

          </div>


          {/* Message */}

          <div className="mt-6">

            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Message
            </p>

            <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-5">

              <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                {message.message}
              </p>

            </div>

          </div>

        </div>


        {/* Footer */}

        <div className="shrink-0 border-t border-gray-200 bg-white p-4 sm:p-5">

          <div className="flex flex-col gap-3 sm:flex-row">

            {message.status === "unread" && (
              <button
                type="button"
                disabled={saving}
                onClick={onMarkRead}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <MailOpen size={16} />
                )}

                MARK AS READ
              </button>
            )}

            {message.status !== "replied" && (
              <button
                type="button"
                disabled={saving}
                onClick={onMarkReplied}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-rotaract px-5 py-3 text-sm font-bold text-white transition hover:bg-rotaract-dark disabled:opacity-50"
              >
                {saving ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <CheckCheck size={16} />
                )}

                MARK AS REPLIED
              </button>
            )}

          </div>

        </div>

      </aside>

    </div>
  );
}


/* ========================================
   DETAIL
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
   DATE
======================================== */

function formatMessageDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString(
    "en-NG",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}