"use client";

export default function GuidedTour({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {/* Demo overlay badge */}
      <div className="absolute top-2 right-2 z-50 text-xs px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
        Live Demo
      </div>

      {children}
    </div>
  );
}
