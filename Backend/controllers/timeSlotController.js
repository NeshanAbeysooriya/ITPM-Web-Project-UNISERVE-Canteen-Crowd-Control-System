import TimeSlot from "../models/TimeSlot.js";

const isExpired = (slot) => new Date(slot.endTime).getTime() < Date.now();

// Vendor creates a new slot
export const createSlot = async (req, res) => {
  try {
    const { startTime, endTime, maxCapacity } = req.body;

    // Basic validation
    if (!startTime || !endTime || !maxCapacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const capacity = Number(maxCapacity);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid start/end time" });
    }

    if (end <= start) {
      return res.status(400).json({ message: "End Time must be after Start Time" });
    }

    if (start < new Date()) {
      return res.status(400).json({ message: "Start time cannot be in the past" });
    }

    if (!Number.isInteger(capacity) || capacity <= 0) {
      return res.status(400).json({ message: "Max Capacity must be a positive whole number" });
    }

    const newSlot = new TimeSlot({
      startTime: start,
      endTime: end,
      maxCapacity: capacity,
      currentOrders: 0,
      status: "Available",
    });

    await newSlot.save();
    res.status(201).json({ message: "Slot created successfully", slot: newSlot });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all slots
export const getSlots = async (req, res) => {
  try {
    // Auto-close past slots so frontend booking is disabled for expired dates.
    await TimeSlot.updateMany(
      { endTime: { $lt: new Date() }, status: { $ne: "Closed" } },
      { $set: { status: "Closed" } }
    );

    const slots = await TimeSlot.find().sort({ startTime: 1 });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student books a slot
export const bookSlot = async (req, res) => {
  try {
    const { slotId } = req.body;

    const slot = await TimeSlot.findById(slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    if (isExpired(slot)) {
      if (slot.status !== "Closed") {
        slot.status = "Closed";
        await slot.save();
      }
      return res.status(400).json({ message: "Slot is expired" });
    }

    if (slot.status !== "Available") {
      return res.status(400).json({ message: `Slot is ${slot.status}` });
    }

    if (slot.currentOrders >= slot.maxCapacity) {
      slot.status = "Full"; // Auto-close when full
      await slot.save();
      return res.status(400).json({ message: "Slot is full" });
    }

    slot.currentOrders += 1;

    if (slot.currentOrders >= slot.maxCapacity) slot.status = "Full";

    await slot.save();
    res.status(200).json({ message: "Slot booked successfully", slot });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vendor updates slot capacity or closes slot
export const updateSlot = async (req, res) => {
  try {
    const { slotId, maxCapacity, status } = req.body;

    const slot = await TimeSlot.findById(slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    if (maxCapacity !== undefined) {
      const capacity = Number(maxCapacity);
      if (!Number.isInteger(capacity) || capacity <= 0) {
        return res.status(400).json({ message: "Max Capacity must be a positive whole number" });
      }

      if (capacity < slot.currentOrders) {
        return res.status(400).json({ message: "Capacity cannot be less than current orders" });
      }

      slot.maxCapacity = capacity;
    }
    if (status) slot.status = status;

    // Adjust status if currentOrders >= maxCapacity
    if (slot.currentOrders >= slot.maxCapacity) slot.status = "Full";

    await slot.save();
    res.status(200).json({ message: "Slot updated successfully", slot });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};