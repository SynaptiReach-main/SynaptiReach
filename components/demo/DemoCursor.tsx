"use client";
import { useEffect, useState } from "react";

export default function DemoCursor({ action }: any) {
  const [pos, setPos] = useState({ x: 200, y: 200 });
  const [visible, setVisible] = useState(true);

  // Hide when real user moves mouse
  useEffect(() => {
    let timeout: any;

    const onMove = () => {
      setVisible(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setVisible(true), 2000);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Controlled intelligent movement
  useEffect(() => {
    if (!action) return;

    const el = document.querySelector(action.target);
    if (!el) return;

    const rect = el.getBoundingClientRect();

    setPos({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });

    if (action.click) {
      setTimeout(() => {
        (el as HTMLElement).click();
      }, 500);
    }
  }, [action]);

  return (
    <div
      className="fixed z-40 pointer-events-none transition-all duration-500"
      style={{
        left: pos.x,
        top: pos.y,
        opacity: visible ? 0.7 : 0,
      }}
    >
      <div className="w-4 h-4 bg-cyan-400 rounded-full blur-[2px]" />
    </div>
  );
}
