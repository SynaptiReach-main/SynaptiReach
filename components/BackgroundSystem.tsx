"use client";
import { useEffect, useState } from "react";

const GRID = 40;
const MAX_LENGTH = GRID * 1.5;

function snap(val: number) {
  return Math.round(val / GRID) * GRID;
}

export default function BackgroundSystem() {
  const [lines, setLines] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const horizontal = Math.random() > 0.5;

      const startX = snap(Math.random() * window.innerWidth);
      const startY = snap(Math.random() * window.innerHeight);

      const length = Math.random() * MAX_LENGTH * 0.9 + GRID * 0.4;

      const id = Math.random().toString(36).slice(2);
      const duration = 700 + Math.random() * 900;

      setLines((prev) => [
        ...prev.slice(-35),
        {
          id,
          horizontal,
          startX,
          startY,
          length,
          duration,
        },
      ]);

      setTimeout(() => {
        setLines((prev) => prev.filter((l) => l.id !== id));
      }, duration + 400);
    }, 90);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

      {/* GRID */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: `${GRID}px ${GRID}px`,
        }}
      />

      {/* GLOW PULSE (RESTORED + BIGGER + SLOWER) */}
      <div className="absolute inset-0 animate-pulse-slow opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(0,255,255,0.16),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_85%,rgba(0,255,255,0.16),transparent_65%)]" />
      </div>

      {/* SYNAPSES */}
      {lines.map((l) => (
        <div
          key={l.id}
          className="absolute"
          style={{
            left: l.startX,
            top: l.startY,
            animation: `move-${l.id} ${l.duration}ms linear forwards`,
          }}
        >

          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: l.horizontal ? `${l.length}px` : "2px",
              height: l.horizontal ? "2px" : `${l.length}px`,

              background: l.horizontal
                ? "linear-gradient(to left, rgba(0,255,255,0.95), transparent)"
                : "linear-gradient(to top, rgba(0,255,255,0.95), transparent)",

              filter: "blur(0.7px)",
              opacity: 0.9,
            }}
          />

          <style>
            {`
              @keyframes move-${l.id} {
                0% {
                  transform: translate(0, 0);
                  opacity: 1;
                }
                100% {
                  transform: ${
                    l.horizontal
                      ? `translate(${l.length}px, 0)`
                      : `translate(0, ${l.length}px)`
                  };
                  opacity: 0;
                }
              }
            `}
          </style>
        </div>
      ))}
    </div>
  );
}
