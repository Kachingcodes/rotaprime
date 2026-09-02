"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ContactDrawer from "./ContactDrawer";

export default function Hero() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    // <section className="relative min-h-screen w-full overflow-hidden bg-hero text-white">
    <section className="relative h-[720px] w-full overflow-hidden bg-hero text-white sm:min-h-screen sm:h-auto">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/background.png"
          alt="Rotaract members serving the community"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Dark overlay */}
        {/* <div className="absolute inset-0 bg-hero/9" /> */}

        {/* Gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-hero via-hero/90 to-transparent" />
      </div>

      {/* Main container */}
      {/* <div className="relative z-10 flex min-h-screen flex-col px-5 sm:px-8 lg:px-12 xl:px-16"> */}
      <div className="relative z-10 flex h-full flex-col px-5 sm:min-h-screen sm:h-auto sm:px-8 lg:px-12 xl:px-16">
        {/* ================================
            Navigation
        ================================= */}
        <header className="flex items-center justify-between py-5 sm:py-6 lg:py-8">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20">
              <Image
                src="/images/logo2.png"
                alt="Rotaract Lagos Prime"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>

          {/* Right Navigation */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Contact */}
            <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="text-sm font-medium text-white/80 transition hover:text-white cursor-pointer border-rotaract border rounded-full hover:bg-rotaract/10 px-4 py-2 sm:px-5 sm:py-2.5 transition duration-300 hover:scale-105"
                >
                CONTACT US
                </button>

            {/* Join */}
            <Link
              href="/join"
              className="rounded-full bg-rotaract px-5 py-2.5 text-sm font-bold transition duration-300 hover:scale-105 hover:bg-rotaract-dark sm:px-6 sm:py-3 sm:text-sm"
            >
              JOIN US
            </Link>

          </div>
        </header>

        {/* ================================
            Hero Content
        ================================= */}
        <div className="flex flex-1 items-center">
          <div className="max-w-3xl">

            {/* Eyebrow */}
            <div className="mb-6 flex items-center gap-4">
              <span className="h-[3px] w-12 shrink-0 bg-rotaract" />

              <span className="text-xs font-bold uppercase tracking-[0.15em] text-rotaract sm:text-sm sm:tracking-[0.2em]">
                Together, We Can Change Lives
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Creating Change.
              <br />

              <span className="text-white">
                Inspiring Leaders.
              </span>

              <br />

              <span className="text-rotaract mt-4 block text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Serving Our Community.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              We are a community of young leaders taking action, building
              meaningful connections, and creating lasting impact in Lagos
              and beyond.
            </p>

            {/* ================================
                CTA Buttons
            ================================= */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">

              {/* Join */}
              <Link
                href="/join"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-rotaract px-7 py-4 text-sm font-bold transition duration-300 hover:-translate-y-1 hover:bg-rotaract-dark hover:shadow-xl"
              >
                {/* Users Icon */}
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

                JOIN ROTARACT

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              {/* Donate */}
              <Link
                href="#donate"
                className="group inline-flex items-center justify-center gap-3 rounded-full border border-rotaract bg-transparent px-7 py-4 text-sm font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-rotaract/10"
              >
                {/* Heart Icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M20.84 4.61C19.75 3.52 18.26 3 16.75 3C15.24 3 13.75 3.52 12.66 4.61L12 5.27L11.34 4.61C9.25 2.52 5.85 2.52 3.76 4.61C1.67 6.7 1.67 10.1 3.76 12.19L12 20.43L20.24 12.19C22.33 10.1 22.33 6.7 20.84 4.61Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                SUPPORT OUR WORK

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            {/* CTA descriptions */}
            <div className="mt-5 lg:flex hidden flex-col gap-4 text-sm text-white/55 sm:flex-row sm:gap-14">
              <p className="max-w-[190px]">
                Become a member and be part of the change.
              </p>

              <p className="max-w-[210px]">
                Donate and help us create greater community impact.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================
          Decorative Element
      ================================= */}
      {/* Rotaract decorative wheel */}
      <div className="pointer-events-none absolute -bottom-36 -right-28 z-10 hidden lg:block">
        <Image
          src="/images/wheel.png"
          alt=""
          width={420}
          height={420}
          className="object-contain opacity-60"
          aria-hidden="true"
        />
      </div>

      <ContactDrawer
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        />

    </section>
  );
}