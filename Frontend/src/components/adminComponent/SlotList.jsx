import React from "react";

export default function AdminSlotList({ slots, loading, onUpdate, onClose }) {
  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-[#E5E7EB] text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
              <th className="px-8 py-5">Slot Timing</th>
              <th className="px-6 py-5 text-center">Orders/Limit</th>
              <th className="px-6 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={4} className="px-8 py-16 text-center text-gray-300 font-bold uppercase tracking-widest animate-pulse">Syncing...</td></tr>
            ) : slots.length === 0 ? (
              <tr><td colSpan={4} className="px-8 py-16 text-center text-gray-300 font-bold uppercase tracking-widest">No Records Found</td></tr>
            ) : (
              slots.map((slot) => (
                <tr key={slot._id} className="hover:bg-gray-50/30 transition-all">
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-[#1F2937]">
                      {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-[10px] text-gray-400 font-black mt-1 uppercase">{new Date(slot.startTime).toDateString()}</div>
                  </td>
                  
                  <td className="px-6 py-6 text-center">
                    <div className="inline-block text-center">
                      <div className="text-xs font-black text-[#1F2937] mb-2">{slot.currentOrders} / {slot.maxCapacity}</div>
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                        <div 
                          className="h-full bg-[#22C55E]" 
                          style={{ width: `${Math.min((slot.currentOrders/slot.maxCapacity)*100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-6 text-center">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-lg border-2 ${
                      slot.status === "Available" ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-100 border-gray-200 text-gray-400"
                    }`}>
                      {slot.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      {/* Edit Button with Green Border */}
                      <button
                        onClick={() => {
                          const val = prompt("Set Capacity:", slot.maxCapacity);
                          if (val) onUpdate(slot._id, { maxCapacity: Number(val) });
                        }}
                        className="px-4 py-2 bg-white border-2 border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E] hover:text-white rounded-xl transition-all text-[10px] font-black"
                      >
                        EDIT
                      </button>
                      {/* Delete/Close Button with Red Border */}
                      <button
                        onClick={() => onClose(slot._id)}
                        className="px-4 py-2 bg-white border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all text-[10px] font-black"
                      >
                        CLOSE
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}