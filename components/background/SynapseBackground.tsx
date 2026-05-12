"use client";
import { useEffect, useRef } from "react";

export default function SynapseBackground() {
  const canvasRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let lines: any[] = [];

    function spawn() {
      const horizontal = Math.random() > 0.5;

      lines.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: 100,
        progress: 0,
        speed: 4,
        horizontal,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lines.forEach((l, i) => {
        ctx.beginPath();

        let x2 = l.horizontal
          ? l.x + l.progress
          : l.x;

        let y2 = l.horizontal
          ? l.y
          : l.y + l.progress;

        const gradient = ctx.createLinearGradient(l.x, l.y, x2, y2);
        gradient.addColorStop(0, "rgba(0,255,255,1)");
        gradient.addColorStop(1, "rgba(0,255,255,0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;

        ctx.moveTo(l.x, l.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        l.progress += l.speed;

        if (l.progress > l.length) {
          lines.splice(i, 1);
        }
      });

      if (Math.random() > 0.9) spawn();

      requestAnimationFrame(draw);
    }

    draw();
  }, []);

  return (
    <canvas className="fixed top-0 left-0 w-full h-full -z-10 opacity-40" ref={canvasRef} />
  );
}
