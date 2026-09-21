"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserRoundPlus,
  MessageCircle,
  Settings,
  Menu,
  HeartHandshake,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Members",
      href: "/admin/members",
      icon: UserRoundPlus,
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: MessageCircle,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
    {
    name: "Welfare",
    href: "/welfare",
    icon: HeartHandshake,
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
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.2 : 2}
                  className="shrink-0"
                />

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
            <Menu size={24} strokeWidth={2} />
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
