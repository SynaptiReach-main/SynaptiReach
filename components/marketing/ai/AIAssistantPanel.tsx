"use client";

import {
  Sparkles,
  Wand2,
  BrainCircuit,
  Loader2,
} from "lucide-react";

interface Props {
  type: "email" | "sms" | "social";
  prompt: string;
  setPrompt: (value: string) => void;
  credits: number;
  onGenerate: () => void;
  loading?: boolean;
  error?: string;
}

export default function AIAssistantPanel({
  type,
  prompt,
  setPrompt,
  credits,
  onGenerate,
  loading = false,
  error,
}: Props) {
  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-5">

      <div className="flex items-center gap-3 mb-5">

        <div className="w-12 h-12 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center">
          <BrainCircuit
            className="text-cyan-300"
            size={22}
          />
        </div>

        <div>

          <h3 className="text-xl font-black text-white">
            AI Campaign Assistant
          </h3>

          <p className="text-sm text-gray-400">
            Autonomous {type} campaign intelligence
          </p>

        </div>

      </div>

      <textarea
        value={prompt}
        onChange={(e) =>
          setPrompt(e.target.value)
        }
        placeholder={`Describe your ${type} campaign goals...`}
        className="w-full min-h-[160px] rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none"
      />

      <div className="flex items-center justify-between mt-4">

        <div className="text-sm text-cyan-300">
          Estimated AI Credits: {credits}
        </div>

        <button
          onClick={onGenerate}
          disabled={loading || !prompt.trim()}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 text-black font-black flex items-center gap-2"
        >
          {loading ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Sparkles size={18} />
          )}
          {loading ? "Generating..." : "Generate Campaign"}
        </button>

      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">

        {[
          "Optimize conversion",
          "Improve targeting",
          "Generate full sequence",
          "Find best send times",
          "Rewrite CTA",
          "Generate viral hook",
        ].map((item) => (
          <button
            key={item}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-300 hover:border-cyan-400/30 transition"
          >
            <div className="flex items-center gap-2">
              <Wand2 size={15} />
              {item}
            </div>
          </button>
        ))}

      </div>

    </div>
  );
}
