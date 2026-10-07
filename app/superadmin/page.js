"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
ShieldCheck,
Users,
UserCog,
KeyRound,
Settings,
ArrowRight,
LayoutDashboard,
HeartHandshake,
Moon,
Sun,
LogOut,
Menu,
X,
} from "lucide-react";

const sections = [
{
title: "User Accounts",
description:
"Onboard users, manage account status, and control account access.",
href: "/superadmin/accounts",
icon: Users,
},
{
title: "Permissions",
description:
"Manage positions, permissions, and what users are allowed to access.",
href: "/superadmin/permissions",
icon: UserCog,
},
{
title: "Password Management",
description:
"Reset user passwords and manage password-related account actions.",
href: "/superadmin/passwords",
icon: KeyRound,
},
{
title: "System Settings",
description:
"Manage system-level settings available only to the Super Admin.",
href: "/superadmin/settings",
icon: Settings,
},
];

export default function SuperAdminPage() {
const [darkMode, setDarkMode] = useState(false);
const [menuOpen, setMenuOpen] = useState(false);

useEffect(() => {
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  setDarkMode(true);
  document.documentElement.classList.add("dark");
} else {
  setDarkMode(false);
  document.documentElement.classList.remove("dark");
}

}, []);

function toggleTheme() {
const nextMode = !darkMode;

setDarkMode(nextMode);

if (nextMode) {
  document.documentElement.classList.add("dark");
  localStorage.setItem("theme", "dark");
} else {
  document.documentElement.classList.remove("dark");
  localStorage.setItem("theme", "light");
}

setMenuOpen(false);

}

async function handleLogout() {
try {
const response = await fetch("/api/auth/logout", {
method: "POST",
});

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  window.location.href = "/login";
} catch (error) {
  console.error("Logout error:", error);
}

}

  return ( 
    <main className="min-h-screen bg-[var(--cream)] px-5 py-8 transition-colors md:px-8"> 
    
    <div className="mx-auto w-full max-w-7xl">
      {/* Top */} 
      <div className="mb-8">

        {/* Header + Mobile/Tablet Menu */} 
        <div className="flex items-start justify-between gap-4">
        
        {/* Header */} 
        <div> 
          <div className="mb-3 flex items-center gap-3"> 
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d41367] text-white"> 
              <ShieldCheck size={22} /> 
              </div>
              <div>
                <p className="text-sm font-medium text-[#d41367]">
                  Administration
                </p>

                <h1 className="text-2xl font-semibold text-[var(--dark)]">
                  Super Admin
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-[var(--dark)]">
              Manage user accounts, permissions, passwords, and system-level
              administration.
            </p>
          </div>

            {/* Mobile / Tablet Navigation */}
            <div className="relative shrink-0 lg:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-[#d41367]/30"
              >
                {menuOpen ? 
                  <X size={20} /> : <Menu size={20} />}
              </button>

              {menuOpen && (
                <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                  <div className="text-gray-600 transition hover:bg-[#fce1ec] hover:text-[#d41367] cursor-pointer">  
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium"
                    >
                      <LayoutDashboard size={17} />
                      Admin
                    </Link>
                  </div>

                  <div className="text-gray-600 transition hover:bg-[#fce1ec] hover:text-[#d41367]">
                    <Link
                      href="/welfare"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition hover:bg-[#fce1ec]"
                    >
                      <HeartHandshake size={17} />
                      Welfare
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-gray-600 transition hover:bg-[#fce1ec] hover:text-[#d41367]"
                  >
                    {darkMode ? <Sun size={17} /> : <Moon size={17} />}
                    {darkMode ? "Light mode" : "Dark mode"}
                  </button>

                  <div className="border-t border-gray-100" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-gray-600 hover:text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="mt-5 hidden items-center justify-end gap-2 text-gray-900 lg:flex">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:border-[#d41367]/30 hover:text-[#d41367]"
            >
              <LayoutDashboard size={17} />
              Admin
            </Link>

            <Link
              href="/welfare"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:border-[#d41367]/30 hover:text-[#d41367]"
            >
              <HeartHandshake size={17} />
              Welfare
            </Link>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-[#d41367]/30 hover:text-[#d41367]"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:text-red-600"
            >
              <LogOut size={17} />
              Log out
            </button>
          </div>
        </div>

        {/* Sections */}
        <div className="grid gap-5 sm:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.title}
                href={section.href}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-[#d41367]/30 hover:shadow-sm"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fce1ec] text-[#d41367]">
                    <Icon size={21} />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-gray-500 transition group-hover:translate-x-1 group-hover:text-[#d41367]"
                  />
                </div>

                <h2 className="text-base font-semibold text-black">
                  {section.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {section.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>

);
}
