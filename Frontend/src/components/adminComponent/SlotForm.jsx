import React, { useState } from "react";

export default function SlotForm({ onCreate }) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !startTime || !endTime || !maxCapacity) {
      setError("Fill all fields");
      return;
    }
    onCreate({ date, startTime, endTime, maxCapacity, currentOrders: 0, status: "Available" });
    setDate(""); setStartTime(""); setEndTime(""); setMaxCapacity(""); setError("");
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && (
          <div className="bg-orange-50 border-l-4 border-orange-400 p-3 text-orange-700 text-xs font-black uppercase tracking-widest">
            Error: {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          {/* Date Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">Pickup Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-[#22C55E] focus:bg-white outline-none font-bold text-[#1F2937] transition-all"
              min={today}
            />
          </div>

          {/* Time Range */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-[#22C55E] focus:bg-white outline-none font-bold transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-[#22C55E] focus:bg-white outline-none font-bold transition-all"
            />
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">Max Capacity</label>
            <input
              type="number"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-[#22C55E] focus:bg-white outline-none font-bold transition-all"
            />
          </div>
        </div>

        {/* Submit Button - Highlighted with Border */}
        <div className="flex justify-end pt-2 border-t border-gray-50">
          <button 
            type="submit" 
            className="px-10 py-4 bg-[#22C55E] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#1faa4f] hover:shadow-lg hover:shadow-green-100 transition-all border-b-4 border-[#188a3f] active:border-b-0 active:translate-y-1"
          >
            Generate Time Slot
          </button>
        </div>
      </form>
    </div>
  );
}