import React, { useEffect, useState } from "react";
import AdminTimeSlotManagement from "./adminTimeSlotManagement";
import Notification from "../../components/adminComponent/Notification.jsx";
import AdminSlotList from "../../components/adminComponent/SlotList.jsx";
import SlotForm from "../../components/adminComponent/SlotForm.jsx";
import { createSlot, getSlots, updateSlot } from "../../api/timeslotApi.js";

export default function TimeSlotAdminPanel() {
  const [slots, setSlots] = useState([]);
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);

  const stats = {
    total: slots.length,
    full: slots.filter((s) => s.currentOrders >= s.maxCapacity).length,
    pending: slots.filter((s) => s.status === "Available").length,
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 2500);
  };

  const loadSlots = async () => {
    setLoading(true);
    try {
      const data = await getSlots();
      setSlots(data);
    } catch (error) {
      showNotification(error.message || "Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const handleCreate = async (slot) => {
    try {
      const startTime = new Date(`${slot.date}T${slot.startTime}`).toISOString();
      const endTime = new Date(`${slot.date}T${slot.endTime}`).toISOString();
      await createSlot({
        startTime,
        endTime,
        maxCapacity: Number(slot.maxCapacity),
      });
      await loadSlots();
      showNotification("Slot created successfully");
    } catch (error) {
      showNotification(error.message || "Failed to create slot");
    }
  };

  const handleUpdate = async (slotId, updated) => {
    try {
      await updateSlot({ slotId, ...updated });
      await loadSlots();
      showNotification("Slot updated successfully");
    } catch (error) {
      showNotification(error.message || "Failed to update slot");
    }
  };

  const handleClose = async (slotId) => {
    try {
      await updateSlot({ slotId, status: "Closed" });
      await loadSlots();
      showNotification("Slot closed successfully");
    } catch (error) {
      showNotification(error.message || "Failed to close slot");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Top Header Section */}
      <div className="w-full bg-white border-b border-[#E5E7EB] mb-10">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <AdminTimeSlotManagement stats={stats} />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Full-Width Form Section */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-black text-[#1F2937] whitespace-nowrap">Add New Schedule</h2>
            <div className="h-[2px] w-full bg-[#E5E7EB]"></div>
          </div>
          <SlotForm onCreate={handleCreate} />
        </section>

        {/* Full-Width List Section */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-black text-[#1F2937] whitespace-nowrap">Current Availability</h2>
            <div className="h-[2px] w-full bg-[#E5E7EB]"></div>
          </div>
          <AdminSlotList
            slots={slots}
            loading={loading}
            onUpdate={handleUpdate}
            onClose={handleClose}
          />
        </section>
      </main>
      
      <Notification message={notification} />
    </div>
  );
}