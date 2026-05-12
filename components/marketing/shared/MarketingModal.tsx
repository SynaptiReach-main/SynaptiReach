"use client";

import { X } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function MarketingModal({
  open,
  title,
  children,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">

      <div className="w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-3xl border border-cyan-500/20 bg-[#061018] shadow-2xl">

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#061018]/95 backdrop-blur-xl px-6 py-5">

          <div>

            <h2 className="text-2xl font-black text-white">
              {title}
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              SynaptiReach AI Marketing Engine
            </p>

          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center hover:bg-red-500/20 transition"
          >
            <X className="text-white" size={20} />
          </button>

        </div>

        <div className="p-6">
          {children}
        </div>

      </div>

    </div>
  );
}
