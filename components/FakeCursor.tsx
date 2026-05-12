"use client";
import { useEffect, useState } from "react";

export default function FakeCursor() {
  const [pos, setPos] = useState({ x: 100, y: 100 });

  useEffect(() => {
    const interval = setInterval(() => {
      setPos({
        x: Math.random() * window.innerWidth * 0.6,
        y: Math.random() * window.innerHeight * 0.4,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: "rgba(0,255,255,1)",
        boxShadow: "0 0 12px rgba(0,255,255,0.9)",
        pointerEvents: "none",
        transition: "all 0.6s ease",
      }}
    />
  );
}
