"use client";

import { RiLoader4Line } from "react-icons/ri";

export default function LeaveTeamModal({
  onClose,
  onConfirm,
  isLoading = false,
}: {
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black border border-red-500/70 rounded-xl p-8 w-[420px] shadow-[0_0_40px_rgba(255,0,0,0.15)] font-mono">
        <h3 className="text-xl font-semibold mb-4 text-red-500 tracking-widest uppercase">
          ⚠ TERMINATE_CLUSTER
        </h3>

        <p className="text-white/70 mb-8 tracking-wide">
          Are you sure you want to disconnect from this cluster? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 border border-[#CCFF00]/50 text-[#CCFF00] rounded tracking-widest hover:bg-[#CCFF00]/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &gt; ABORT
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-3 bg-red-600 text-white rounded tracking-widest hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <RiLoader4Line className="w-4 h-4 animate-spin" />}
            &gt; CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
}
