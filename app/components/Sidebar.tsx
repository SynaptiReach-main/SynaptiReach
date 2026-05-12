export {};
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `block px-3 py-2 rounded ${
      pathname === path ? "bg-white text-[#0A0F1F]" : "text-gray-300 hover:bg-gray-800"
    }`;

  return (
    <div className="w-64 bg-black text-white p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-6">SynaptiReach</h1>

      <nav className="space-y-2">
        <Link href="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
        </Link>

        <Link href="/crm" className={linkClass("/crm")}>
          CRM
        </Link>

        <Link href="/ai" className={linkClass("/ai")}>
          AI Assistant
        </Link>

        <Link href="/social" className={linkClass("/social")}>
          Social
        </Link>

        <Link href="/settings" className={linkClass("/settings")}>
          Settings
        </Link>
      </nav>
    </div>
  );
}
