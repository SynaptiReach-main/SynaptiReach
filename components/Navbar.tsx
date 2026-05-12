"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  Play,
  DollarSign,
  Rocket,
  Briefcase,
  Mail
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    if (open) window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);

  const handleNav = (e: any) => {
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-3 md:px-6 py-2 md:py-3 backdrop-blur-md">

        {/* LEFT */}
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            className="text-white text-2xl md:text-4xl z-50"
          >
            {open ? "✕" : "☰"}
          </button>

          <Link href="/" onClick={handleNav} className="flex items-center gap-1 md:gap-2">
            <img
              src="/logo.png"
              className="h-10 w-10 md:h-20 md:w-20 object-contain"
            />
            <span className="text-base md:text-2xl font-semibold leading-none">
              <span className="text-white">Synapti</span>
              <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                Reach
              </span>
            </span>
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/signin"
            onClick={handleNav}
            className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-lg bg-white/10 backdrop-blur text-white whitespace-nowrap"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            onClick={handleNav}
            className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-lg bg-gradient-to-r from-cyan-400 to-green-400 text-black font-semibold whitespace-nowrap"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* SIDEBAR */}
      {open && (
        <>
          <div className="fixed inset-0 backdrop-blur-md z-40" />

          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed top-0 left-0 h-full w-80 bg-black/95 z-50 p-5 flex flex-col"
          >
            {/* HEADER */}
            <div className="flex items-center gap-2 mb-4">

              <button
                onClick={() => setOpen(false)}
                className="text-white text-4xl mr-1"
              >
                ✕
              </button>

              <Link href="/" onClick={handleNav} className="flex items-center gap-2">
                <img src="/logo.png" className="h-20 w-20 object-contain" />
                <span className="text-2xl font-semibold leading-none">
                  <span className="text-white">Synapti</span>
                  <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                    Reach
                  </span>
                </span>
              </Link>
            </div>

            <div className="border-b border-white/10 mb-4" />

            {/* NAV ITEMS WITH ICONS */}
            <div className="flex flex-col gap-4 text-gray-300">
              <Link href="/" onClick={handleNav} className="flex items-center gap-3 hover:text-white">
                <Home size={18} />
                Home
              </Link>

              <Link href="/demo" onClick={handleNav} className="flex items-center gap-3 hover:text-white">
                <Play size={18} />
                Demo
              </Link>

              <Link href="/pricing" onClick={handleNav} className="flex items-center gap-3 hover:text-white">
                <DollarSign size={18} />
                Pricing
              </Link>

              <Link href="/trial" onClick={handleNav} className="flex items-center gap-3 hover:text-white">
                <Rocket size={18} />
                Trial
              </Link>

              <Link href="/services" onClick={handleNav} className="flex items-center gap-3 hover:text-white">
                <Briefcase size={18} />
                Services
              </Link>

              <Link href="/contact" onClick={handleNav} className="flex items-center gap-3 hover:text-white">
                <Mail size={18} />
                Contact
              </Link>
            </div>

            <div className="border-b border-white/10 my-6" />

            {/* AUTH BUTTONS */}
            <div className="flex flex-col gap-3">
              <Link href="/signin" onClick={handleNav} className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur text-white text-center">
                Sign In
              </Link>
              <Link href="/signup" onClick={handleNav} className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-green-400 text-black font-semibold text-center">
                Sign Up
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
