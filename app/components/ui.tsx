export {};
"use client"

export function GradientCard({ children, className = "" }) {
  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-r from-cyan-400 to-emerald-400">
      <div className={`bg-[#111827] rounded-2xl ${className}`}>
        {children}
      </div>
    </div>
  )
}

export function GradientButton({ children, className = "", ...props }) {
  return (
    <button
      className={`w-full py-3 rounded-full font-semibold text-[#0A0F1F] bg-gradient-to-r from-cyan-400 to-emerald-400 hover:scale-[1.02] transition ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function GradientText({ children, className = "" }) {
  return (
    <span
      className={`bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  )
}

