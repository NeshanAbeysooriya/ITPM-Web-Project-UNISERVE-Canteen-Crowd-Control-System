import React from "react";
import SlotList from "../components/SlotList";

const UserTimeSlotPage = () => {
  return (
    <div className="pt-18">
      <main className="page-container py-8 sm:py-10">
        <div className="section-card">
          <div className="section-card-header text-center"> {/* ✅ Center text */}
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Available Pickup Slots
            </h1>
            <p className="text-sm muted mt-1">
              Select an available time slot and book your pickup.
            </p>
          </div>
          <div className="section-card-body">
            <SlotList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserTimeSlotPage;