export {};
"use client";

import { useState } from "react";

export default function DemoVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative py-20 px-4">

      <div className="max-w-5xl mx-auto text-center">

        {/* Heading */}
        <h2 className="text-2xl md:text-4xl font-bold mb-4">
          See SynaptiReach in Action
        </h2>

        <p className="text-white/60 mb-10 max-w-xl mx-auto">
          Watch how AI automates your marketing, sales, and customer growth in one unified system.
        </p>

        {/* Video Container */}
        <div className="relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden">

          {/* Glow */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-br from-cyan-500/10 to-green-500/10" />

          {!playing ? (
            <div
              onClick={() => setPlaying(true)}
              className="cursor-pointer flex items-center justify-center h-[240px] md:h-[420px]"
            >
              <div className="flex flex-col items-center gap-4">

                <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-2xl hover:scale-110 transition">
                  ▶
                </div>

                <div className="text-sm text-white/60">
                  Watch 60s demo
                </div>

              </div>
            </div>
          ) : (
            <iframe
              className="w-full h-[240px] md:h-[420px]"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Demo Video"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )}
        </div>

      </div>
    </section>
  );
}
