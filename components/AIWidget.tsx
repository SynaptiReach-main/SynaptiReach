"use client";

import { useEffect, useState } from "react";

export default function AIWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [hasPromptedScroll, setHasPromptedScroll] = useState(false);
  const [hasPromptedIdle, setHasPromptedIdle] = useState(false);

  const pushMessage = (msg: string) => {
    setMessages((prev) => [...prev, msg]);
  };

  // Track user activity
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());

    window.addEventListener("scroll", updateActivity);
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("click", updateActivity);

    return () => {
      window.removeEventListener("scroll", updateActivity);
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("click", updateActivity);
    };
  }, []);

  // Scroll-based trigger
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.body.scrollHeight - window.innerHeight;
      const percent = scrollY / height;

      if (percent > 0.4 && !hasPromptedScroll) {
        setHasPromptedScroll(true);
        setOpen(true);

        setTimeout(() => {
          pushMessage("Seeing something interesting?");
        }, 800);

        setTimeout(() => {
          pushMessage("I can show you how this would work for your business.");
        }, 2000);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasPromptedScroll]);

  // Idle detection trigger
  useEffect(() => {
    const interval = setInterval(() => {
      const idleTime = Date.now() - lastActivity;

      if (idleTime > 8000 && !hasPromptedIdle) {
        setHasPromptedIdle(true);
        setOpen(true);

        pushMessage("Want me to walk you through this?");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [lastActivity, hasPromptedIdle]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 px-4 py-2 rounded-full bg-cyan-500 text-black font-semibold shadow-lg"
      >
        {open ? "Close" : "Ask AI"}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-20 right-5 w-80 max-w-[90vw] z-50 rounded-xl border border-white/10 bg-[#0A0F1F] backdrop-blur p-4 shadow-2xl">

          <div className="text-sm font-semibold mb-2">
            SynaptiReach AI
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className="text-xs text-cyan-300">
                🤖 {msg}
              </div>
            ))}
          </div>

          <div className="mt-3 space-y-2">

            <button
              onClick={() => pushMessage("Great — what industry are you in?")}
              className="w-full text-xs px-3 py-2 rounded bg-white/10 hover:bg-white/20"
            >
              Show Me How It Works
            </button>

            <button
              onClick={() => pushMessage("You can start free — no credit card required.")}
              className="w-full text-xs px-3 py-2 rounded bg-cyan-500 text-black font-semibold"
            >
              Start Free
            </button>

          </div>

        </div>
      )}
    </>
  );
}
