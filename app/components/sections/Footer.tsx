export {};
"use client";

export default function Footer() {
  return (
    <footer className="py-10 text-center text-white/40 border-t border-white/10">
      © {new Date().getFullYear()} SynaptiReach. All rights reserved.
    </footer>
  );
}
