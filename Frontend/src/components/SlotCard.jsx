import React, { useState } from "react";
import { bookSlot } from "../api/timeslotApi";
import { toast} from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const SlotCard = ({ slot, refreshSlots }) => {
  const location = useLocation(); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const cartFromCheckout = location.state?.cart || [];

const goToOrderPage = (selectedSlotId, selectedTime) => {
  navigate("/checkout", { 
    state: {
      cart: location.state?.cart || [], // use the cart from location.state
      name: location.state?.name || "",
      phone: location.state?.phone || "",
      address: location.state?.address || "",
      slotId: selectedSlotId,
      pickupTime: selectedTime
    }
  });
};
   const handleBook = async () => {
    setLoading(true);
    try {
      await bookSlot(slot._id);
      toast.success("Slot booked successfully!");
      goToOrderPage(slot._id, slot.startTime);
      refreshSlots();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  // Calculate percentage for the elegant progress bar
  const capacityPercentage = Math.min((slot.currentOrders / slot.maxCapacity) * 100, 100);

  return (
    /* Added border-2 border-black as requested */
    <div className="bg-white border-2 border-black rounded-[2rem] p-6 sm:p-8 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group mb-4">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        
        <div className="flex-1 space-y-5">
          {/* Status & Elegant Capacity View */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <span
              className={`w-fit text-[10px] font-black px-4 py-1.5 rounded-full border-2 tracking-widest uppercase ${
                slot.status === "Available"
                  ? "bg-green-50 border-green-500 text-green-600"
                  : slot.status === "Full"
                    ? "bg-orange-50 border-orange-500 text-orange-600"
                    : "bg-gray-50 border-gray-400 text-gray-500"
              }`}
            >
              {slot.status}
            </span>

            {/* Elegant Capacity Gauge */}
            <div className="flex-1 max-w-xs">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Availability</span>
                <span className="text-xs font-bold text-black">{slot.currentOrders} / {slot.maxCapacity}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div 
                  className={`h-full transition-all duration-700 ease-out ${
                    capacityPercentage > 80 ? "bg-orange-500" : "bg-black"
                  }`}
                  style={{ width: `${capacityPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Time Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl border border-black group-hover:bg-green-50 transition-colors">
                🕒
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Starts</p>
                <p className="text-base font-black text-black uppercase">
                  {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl border border-black group-hover:bg-orange-50 transition-colors">
                🏁
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ends</p>
                <p className="text-base font-black text-black uppercase">
                  {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button - Modern High Contrast */}
        <div className="pt-6 lg:pt-0 lg:pl-8 border-t border-gray-100 lg:border-none">
          <button
            disabled={slot.status !== "Available" || loading}
            onClick={handleBook}
            className={`w-full lg:w-48 py-5 px-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
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