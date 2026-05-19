"use client";

import Link from "next/link";
import { INDUSTRY_SOLUTIONS } from "@/lib/marketing/industries";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "CRM", href: "/demo/dashboard" },
      { label: "AI Agents", href: "/ai-agents" },
      { label: "Automation", href: "/automation" },
      { label: "Analytics", href: "/analytics" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Solutions",
    links: INDUSTRY_SOLUTIONS.map((industry) => ({ label: industry.label, href: `/solutions/${industry.slug}` })),
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/security" },
      { label: "Support", href: "/support" },
    ],
  },
];

const bottomLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="relative mx-auto mt-20 w-full max-w-7xl px-5 pb-8 text-white">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-400/15 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur md:p-8">
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(0,229,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(0,230,118,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="pointer-events-none absolute -left-24 top-8 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-8 h-56 w-56 rounded-full bg-green-400/10 blur-3xl" />

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-lg font-black tracking-tight">
                <span className="text-white">Synapti</span>
                <span className="bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
                  Reach
                </span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-cyan-50/60">
              Autonomous CRM, AI agents, marketing automation, analytics, and communications for service businesses.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/trial"
                className="rounded-xl bg-gradient-to-r from-cyan-300 to-green-300 px-4 py-2 text-sm font-black text-black shadow-lg shadow-cyan-500/15"
              >
                Start 14-Day Trial
              </Link>
              <Link
                href="/demo/dashboard"
                className="rounded-xl border border-cyan-300/25 bg-cyan-400/5 px-4 py-2 text-sm font-bold text-cyan-100 hover:border-cyan-300/45"
              >
                View CRM Demo
              </Link>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <div className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
                {section.title}
              </div>
              <div className={`${section.title === "Solutions" ? "grid max-h-56 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-1" : "space-y-2.5"}`}>
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-cyan-50/55 transition hover:text-cyan-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-8 flex flex-col gap-4 border-t border-cyan-400/10 pt-6 text-xs text-cyan-50/45 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} SynaptiReach. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            {bottomLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-cyan-200">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
