export {};
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-4xl font-extrabold text-white">404</h1>
      <p className="text-[#B2EBF2]/60">Page not found</p>
      <a href="/" className="text-[#00FFFF] hover:text-[#00E676] transition-colors text-sm font-semibold">
        ← Back to Home
      </a>
    </div>
  )
}
