import React, { useState } from "react";
import { bookSlot } from "../api/timeslotApi";
import { toast} from "react-hot-toast";

const SlotCard = ({ slot, refreshSlots }) => {
  const [loading, setLoading] = useState(false);

  const goToOrderPage = () => {
    const orderPageBase = import.meta.env.VITE_ORDER_PAGE_URL || "/order";
    const payload = {
      slotId: slot._id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      maxCapacity: slot.maxCapacity,
      currentOrders: slot.currentOrders + 1,
      status: slot.status,
    };

    sessionStorage.setItem("selectedSlot", JSON.stringify(payload));

    const params = new URLSearchParams({
      slotId: payload.slotId,
      startTime: payload.startTime,
      endTime: payload.endTime,
      maxCapacity: String(payload.maxCapacity),
      currentOrders: String(payload.currentOrders),
      status: payload.status,
    });

    window.location.href = `${orderPageBase}?${params.toString()}`;
  };

  const handleBook = async () => {
    setLoading(true);
    try {
      await bookSlot(slot._id);
      toast.success("Slot booked successfully!");
      goToOrderPage();
      refreshSlots();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 transition-all hover:shadow-xl hover:shadow-gray-100 group">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        
        <div className="space-y-4">
          {/* Status & Capacity Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`text-[10px] font-black px-4 py-1.5 rounded-full border-2 tracking-widest uppercase ${
                slot.status === "Available"
                  ? "bg-green-50 border-green-200 text-[#22C55E]"
                  : slot.status === "Full"
                    ? "bg-orange-50 border-orange-200 text-[#F59E0B]"
                    : "bg-gray-50 border-gray-200 text-gray-400"
              }`}
            >
              {slot.status}
            </span>
            <span className="text-[10px] font-black px-4 py-1.5 rounded-full bg-highlight text-white border-2 border-[#1F2937]">
              {slot.currentOrders} / {slot.maxCapacity} FILLED
            </span>
          </div>

          {/* Time Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 group-hover:border-[#22C55E]/30 transition-colors">
                🕒
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Start Time</p>
                <p className="text-sm font-bold text-[#1F2937]">
                  {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 group-hover:border-orange-200 transition-colors">
                🏁
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">End Time</p>
                <p className="text-sm font-bold text-[#1F2937]">
                  {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 lg:pt-0 border-t border-gray-50 lg:border-none">
          <button
            disabled={slot.status !== "Available" || loading}
            onClick={handleBook}
            className={`w-full lg:w-48 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
              slot.status === "Available" && !loading 
                ? "bg-[#22C55E] text-white border-[#188a3f] hover:bg-[#1faa4f] shadow-lg shadow-green-100" 
                : "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
            }`}
          >
            {loading ? "Booking..." : "Book Slot"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotCard;