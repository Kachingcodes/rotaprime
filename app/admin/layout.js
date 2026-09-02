"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="3"
            width="7"
            height="7"
            rx="1"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect
            x="14"
            y="3"
            width="7"
            height="7"
            rx="1"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect
            x="3"
            y="14"
            width="7"
            height="7"
            rx="1"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect
            x="14"
            y="14"
            width="7"
            height="7"
            rx="1"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },

    {
      name: "Members",
      href: "/admin/members",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M16 21V19C16 16.7909 14.2091 15 12 15H6C3.79086 15 2 16.7909 2 19V21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle
            cx="9"
            cy="7"
            r="4"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M19 8V14M22 11H16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },

    {
      name: "Messages",
      href: "/admin/messages",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M21 11.5C21 16.1944 16.9706 20 12 20C10.4415 20 8.98291 19.6334 7.70647 18.9907L3 20L4.29984 16.1994C3.47747 14.8782 3 13.3306 3 11.5C3 6.80558 7.02944 3 12 3C16.9706 3 21 6.80558 21 11.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },

    {
      name: "Settings",
      href: "/admin/settings",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
            stroke="currentColor"
            strokeWidth="2"
          />

          <path
            d="M19.4 15C19.8 14.2 20 13.1 20 12C20 10.9 19.8 9.8 19.4 9L21 7L19 5L17 6.6C16.2 6.2 15.1 6 14 6L13 3H11L10 6C8.9 6 7.8 6.2 7 6.6L5 5L3 7L4.6 9C4.2 9.8 4 10.9 4 12C4 13.1 4.2 14.2 4.6 15L3 17L5 19L7 17.4C7.8 17.8 8.9 18 10 18L11 21H13L14 18C15.1 18 16.2 17.8 17 17.4L19 19L21 17L19.4 15Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  function isActive(href) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        {/* Logo */}
        <div className="flex h-24 items-center border-b border-gray-100 px-6">
          <Link href="/admin" className="flex items-center">
            <div className="relative h-16 w-16">
              <Image
                src="/images/logo2.png"
                alt="Rotaract Lagos Prime"
                fill
                priority
                className="object-contain"
              />
            </div>

            <div className="ml-3">
              <p className="text-sm font-bold">
                Rotaract
              </p>

              <p className="text-xs text-gray-500">
                Lagos Prime
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-6">

          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Administration
          </p>

          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-rotaract/10 text-rotaract"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon}

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-100 p-4">

          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
          >
            <span>←</span>
            Back to website
          </Link>

        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-64">

        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Open menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M4 6H20M4 12H20M4 18H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Page title */}
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold">
              Admin Dashboard
            </h1>

            <p className="text-xs text-gray-500">
              Rotaract Lagos Prime
            </p>
          </div>

          {/* Admin profile */}
          <div className="ml-auto flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">
                Administrator
              </p>

              <p className="text-xs text-gray-500">
                Admin
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rotaract text-sm font-bold text-white">
              A
            </div>

          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}