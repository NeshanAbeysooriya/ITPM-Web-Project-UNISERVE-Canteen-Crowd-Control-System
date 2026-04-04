import React from "react";

export default function Notification({ message }) {
  return message ? (
    <div className="fixed top-6 inset-x-0 z-[100] flex justify-center pointer-events-none animate-in fade-in slide-in-from-top-4">
      <div className="bg-[#1F2937] text-white px-6 py-3 rounded-2xl shadow-2xl pointer-events-auto flex items-center gap-3 border border-white/10">
        <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
        <span className="text-sm font-black tracking-tight">{message}</span>
      </div>
    </div>
  ) : null;
}