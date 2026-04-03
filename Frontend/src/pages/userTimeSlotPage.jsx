import React from "react";
import SlotList from "../components/SlotList";
import Footer from "../components/footer";

const UserTimeSlotPage = () => {
  return (
    /* pt-24 to keep it below header, min-h-screen for background */
    <div className="pt-24 bg-[#F8FAFC] min-h-screen">
      <main className="page-container py-6 sm:py-8 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Section - Reduced mb-12 to mb-6 for a tighter gap */}
          <div className="text-center mb-6 space-y-2">
            <div className="w-8 h-1 bg-[#22C55E] mx-auto rounded-full mb-3"></div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-[#1F2937] tracking-tighter uppercase">
              Available Pickup Slots
            </h1>
            
            <p className="text-sm sm:text-base font-medium text-gray-500 max-w-lg mx-auto">
              Select an available time slot and book your pickup.
            </p>
          </div>

          {/* Slot List Component - Removed extra top margins */}
          <div className="mt-0">
            <SlotList />
          </div>

        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default UserTimeSlotPage;