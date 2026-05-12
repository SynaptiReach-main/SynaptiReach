export {};
"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { GradientText } from "./ui"

// ─────────────────────────────────────────────────────────────────────────────
// Neural Synapse Canvas — Layer 3b Animation
// ─────────────────────────────────────────────────────────────────────────────

interface Signal {
  fromX: number
  fromY: number
  toX: number
  toY: number
  progress: number
  speed: number
  trailLen: number
  done: boolean
}

function SynapseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let signals: Signal[] = []
    let lastSpawn = 0

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function spawnSignal() {
      if (!canvas) return
      const cols = Math.ceil(canvas.width / 40) + 1
      const rows = Math.ceil(canvas.height / 40) + 1
      const fromC = Math.floor(Math.random() * cols)
      const fromR = Math.floor(Math.random() * rows)
      const horizontal = Math.random() > 0.5
      const steps = 1 + Math.floor(Math.random() * 5)
      const negative = Math.random() > 0.5
      let toC = fromC
      let toR = fromR
      if (horizontal) {
        toC = negative ? fromC - steps : fromC + steps
      } else {
        toR = negative ? fromR - steps : fromR + steps
      }
      toC = Math.max(0, Math.min(cols - 1, toC))
      toR = Math.max(0, Math.min(rows - 1, toR))
      if (toC === fromC && toR === fromR) return
      signals.push({
        fromX: fromC * 40,
        fromY: fromR * 40,
        toX:   toC   * 40,
        toY:   toR   * 40,
        progress: 0,
        speed:    0.005 + Math.random() * 0.013,
        trailLen: 0.18  + Math.random() * 0.22,
        done: false,
      })
    }

    function draw(ts: number) {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (ts - lastSpawn > 120 + Math.random() * 260) {
        const burst = 1 + Math.floor(Math.random() * 2)
        for (let i = 0; i < burst; i++) spawnSignal()
        lastSpawn = ts
      }
      signals = signals.filter(s => !s.done)
      for (const s of signals) {
        s.progress = Math.min(1, s.progress + s.speed)
        if (s.progress >= 1) s.done = true
        const dx = s.toX - s.fromX
        const dy = s.toY - s.fromY
        const hx = s.fromX + dx * s.progress
        const hy = s.fromY + dy * s.progress
        const tailT = Math.max(0, s.progress - s.trailLen)
        const tx = s.fromX + dx * tailT
        const ty = s.fromY + dy * tailT
        const trail = ctx.createLinearGradient(tx, ty, hx, hy)
        trail.addColorStop(0,   "rgba(0, 229, 255, 0.00)")
        trail.addColorStop(0.5, "rgba(0, 229, 255, 0.32)")
        trail.addColorStop(1,   "rgba(0, 255, 255, 0.80)")
        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(hx, hy)
        ctx.lineWidth = 1.5
        ctx.strokeStyle = trail
        ctx.stroke()
        const flare = ctx.createRadialGradient(hx, hy, 0, hx, hy, 5.5)
        flare.addColorStop(0,   "rgba(0, 255, 255, 0.95)")
        flare.addColorStop(0.5, "rgba(0, 229, 255, 0.40)")
        flare.addColorStop(1,   "rgba(0, 229, 255, 0.00)")
        ctx.beginPath()
        ctx.arc(hx, hy, 5.5, 0, Math.PI * 2)
        ctx.fillStyle = flare
        ctx.fill()
        if (s.done) {
          const burst = ctx.createRadialGradient(s.toX, s.toY, 0, s.toX, s.toY, 11)
          burst.addColorStop(0,   "rgba(0, 230, 118, 0.65)")
          burst.addColorStop(0.6, "rgba(0, 229, 255, 0.22)")
          burst.addColorStop(1,   "rgba(0, 229, 255, 0.00)")
          ctx.beginPath()
          ctx.arc(s.toX, s.toY, 11, 0, Math.PI * 2)
          ctx.fillStyle = burst
          ctx.fill()
        }
      }
      animId = requestAnimationFrame(draw)
    }

    resize()
    for (let i = 0; i < 10; i++) spawnSignal()
    lastSpawn = 0
    window.addEventListener("resize", resize)
    animId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Nav links
// ─────────────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home",         href: "/" },
  { label: "Pricing",      href: "/pricing" },
  { label: "Services",     href: "/services" },
  { label: "Free Trial",   href: "/trial" },
  { label: "Set-up Guide", href: "/setup-guide" },
]

// ─────────────────────────────────────────────────────────────────────────────
// Wordmark — "Synapti" white, "Reach" cyan→green gradient
// ─────────────────────────────────────────────────────────────────────────────

function Wordmark({ size = "text-xl" }: { size?: string }) {
  return (
    <span className={`font-extrabold tracking-tight ${size} leading-none`}>
      <span className="text-white">Synapti</span>
      <span
        style={{
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Reach
      </span>
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ClientLayout
// ─────────────────────────────────────────────────────────────────────────────

export default function ClientLayout({ children }) {
  const [open, setOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <div className="min-h-screen text-white bg-[#0A0F1F] relative overflow-hidden">

      {/* LAYER 1 */}
      <div className="absolute inset-0 bg-[#0A0F1F]/65 z-0 pointer-events-none" />

      {/* LAYER 2 */}
      <div className="absolute bottom-0 left-0 w-[100vw] h-[60vh] bg-gradient-to-t from-[#0D2A1F]/35 via-transparent to-transparent pointer-events-none z-0" />

      {/* LAYER 3: Static grid */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
            backgroundImage: `radial-gradient(rgba(0, 229, 255, 0.35) 0.8px, transparent 0.8px),
          `,
          backgroundSize: '40px 40px, 40px 40px, 40px 40px',
          backgroundPosition: '0 0, 0 0, 0 0',
        }}
      />

      {/* LAYER 3b: Synapse canvas */}
      <SynapseCanvas />

      {/* LAYER 4: Wave glow */}
      <div
        className="absolute top-[-10%] left-[-20%] w-[140vw] md:w-[120vw] h-[500px] md:h-[800px] bg-gradient-to-br from-cyan-400/75 via-cyan-500/40 to-transparent blur-[110px] md:blur-[140px] z-20 pointer-events-none"
        style={{
          borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
          animation: "waveDrift 18s ease-in-out infinite alternate"
        }}
      />

      {/* ── NAVBAR ── */}
      <header
        className="fixed top-0 left-0 right-0 flex items-center justify-between"
        style={{
          height: "52px",
          zIndex: 50,
          padding: "0 12px",
          background: "rgba(10, 15, 31, 0.88)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0, 229, 255, 0.1)",
        }}
      >
        {/* Left: hamburger + logo + wordmark */}
        <div className="flex items-center" style={{ gap: "6px" }}>

          {/* Hamburger */}
          <button
            onMouseDown={(e) => {
              e.stopPropagation()
              setOpen(prev => !prev)
            }}
            className="flex flex-col justify-center items-center rounded-md hover:bg-white/5 transition-colors shrink-0"
            style={{ width: "32px", height: "32px", gap: "5px" }}
            aria-label="Toggle menu"
          >
            <span
              className="block rounded-full bg-[#B2EBF2] transition-all duration-200 origin-center"
              style={{
                height: "2px", width: "18px",
                transform: open ? "rotate(45deg) translate(0px, 7px)" : "none"
              }}
            />
            <span
              className="block rounded-full bg-[#B2EBF2] transition-all duration-200"
              style={{
                height: "2px", width: "18px",
                opacity: open ? 0 : 1,
                transform: open ? "scaleX(0)" : "scaleX(1)"
              }}
            />
            <span
              className="block rounded-full bg-[#B2EBF2] transition-all duration-200 origin-center"
              style={{
                height: "2px", width: "18px",
                transform: open ? "rotate(-45deg) translate(0px, -7px)" : "none"
              }}
            />
          </button>

          {/* Logo + wordmark — hidden while sidebar is open to avoid duplication */}
          <Link
            href="/"
            className="flex items-center transition-all duration-200"
            style={{
              gap: "5px",
              opacity: open ? 0 : 1,
              pointerEvents: open ? "none" : "auto",
            }}
          >
            <img
              src="/logo.png"
              alt="SynaptiReach logo"
              style={{ height: "72px", width: "72px", objectFit: "contain" }}
            />
            <span className="hidden sm:block">
              <Wordmark size="text-xl" />
            </span>
            <span className="block sm:hidden">
              <Wordmark size="text-base" />
            </span>
          </Link>

        </div>

        {/* Right: Sign In + Sign Up */}
        <div className="flex items-center" style={{ gap: "8px" }}>
          <Link
            href="/signin"
            className="font-semibold text-[#B2EBF2] hover:text-[#00FFFF] transition-colors duration-150 whitespace-nowrap"
            style={{ fontSize: "12px" }}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="font-bold text-[#0A0F1F] rounded-[8px] whitespace-nowrap transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
            style={{
              fontSize: "12px",
              padding: "5px 12px",
            }}
          >
            Sign Up
          </Link>
        </div>

      </header>

      {/* ── BACKDROP ── */}
      {open && (
        <div
          style={{ zIndex: 48 }}
          onMouseDown={() => setOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <div
        ref={sidebarRef}
        className="fixed top-0 left-0 h-full w-72 flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          zIndex: 49,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          background: "rgba(10, 15, 31, 0.96)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRight: "1px solid rgba(0, 229, 255, 0.13)",
        }}
      >
        {/* Logo + wordmark at top of sidebar - Pushed down by 68px to clear the header */}
        <div className="px-6 pt-[68px] pb-4 border-b border-[rgba(0,229,255,0.1)]">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center"
            style={{ gap: "8px" }}
          >
            <img
              src="/logo.png"
              alt="SynaptiReach logo"
              style={{ height: "72px", width: "72px", objectFit: "contain" }}
            />
            <Wordmark size="text-xl" />
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-4 py-5 flex-1">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-[#B2EBF2] text-sm font-medium hover:text-[#00FFFF] hover:bg-[rgba(0,229,255,0.07)] transition-all duration-150"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Sign In / Sign Up at bottom */}
        <div className="px-6 py-5 border-t border-[rgba(0,229,255,0.1)] flex flex-col gap-3">
          <Link
            href="/signin"
            onClick={() => setOpen(false)}
            className="text-center text-sm font-semibold text-[#B2EBF2] hover:text-[#00FFFF] transition-colors duration-150 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            onClick={() => setOpen(false)}
            className="text-center text-sm font-bold text-[#0A0F1F] rounded-[10px] py-2 transition-all duration-200 hover:opacity-90"
            style={{
            }}
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-30 px-4 md:px-10 py-6 pt-[68px]">
        {children}
      </main>

    </div>
  )
}

