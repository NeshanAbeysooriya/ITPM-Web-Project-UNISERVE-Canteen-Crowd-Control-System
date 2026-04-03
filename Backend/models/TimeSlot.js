// models/TimeSlot.js
import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema(
  {
    startTime: {
      type: Date,
      required: true
    },

    endTime: {
      type: Date,
      required: true
    },

    maxCapacity: {
      type: Number,
      required: true,
      min: 1
    },

    currentOrders: {
      type: Number,
      default: 0,
      min: 0
    },

    status: {
      type: String,
      enum: ["Available", "Full", "Closed"],
      default: "Available"
    }
  },
  { timestamps: true } // createdAt, updatedAt automatically
);

const TimeSlot = mongoose.model("TimeSlot", timeSlotSchema);

export default TimeSlot;