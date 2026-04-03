import React, { useEffect, useState } from "react";
import { getSlots } from "../api/timeslotApi";
import SlotCard from "./SlotCard";
import Footer from "./footer";

const SlotList = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const data = await getSlots();
      setSlots(data);
    } catch (err) {
      alert("Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    /* Added pt-24 to push content below the fixed header */
    <div className="max-w-4xl mx-auto space-y-6 px-4 pt-24 pb-12">
      {loading ? (
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-16 text-center shadow-sm">
          <div className="w-12 h-12 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Checking Availability...</p>
        </div>
      ) : slots.length === 0 ? (
        <div className="bg-white rounded-[2rem] border-2 border-dashed border-[#E5E7EB] p-20 text-center">
          <div className="text-4xl mb-4 text-gray-300">📅</div>
          <h3 className="text-xl font-black text-[#1F2937] mb-2">No Slots Found</h3>
          <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto">
            Our schedule is currently empty. Please refresh or check back in a few moments.
          </p>
          <button 
            onClick={fetchSlots}
            className="mt-8 px-8 py-3 bg-white border-2 border-[#1F2937] text-[#1F2937] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1F2937] hover:text-white transition-all"
          >
            Refresh Now
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between px-2 mb-2">
             <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Available Pickups</h2>
             <span className="text-[10px] font-black text-[#22C55E] bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">{slots.length} windows found</span>
          </div>
          {slots.map((slot) => (
            <SlotCard key={slot._id} slot={slot} refreshSlots={fetchSlots} />
          ))}

        
        </div>
      )}
        
    </div>
  );
};

export default SlotList;