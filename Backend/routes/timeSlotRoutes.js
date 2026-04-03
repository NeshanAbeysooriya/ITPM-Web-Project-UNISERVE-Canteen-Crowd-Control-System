import express from "express";
import * as timeSlotController from "../controllers/timeSlotController.js";

const timeslotRouter = express.Router();

/**
 * Vendor creates a new time slot
 * Route: POST /api/slots/create
 */
timeslotRouter.post("/create", timeSlotController.createSlot);

/**
 * Get all slots
 * Route: GET /api/slots
 */
timeslotRouter.get("/", timeSlotController.getSlots);

/**
 * Student books a slot
 * Route: POST /api/slots/book
 */
timeslotRouter.post("/book", timeSlotController.bookSlot);

/**
 * Vendor updates slot (capacity or status)
 * Route: PATCH /api/slots/update
 */
timeslotRouter.patch("/update", timeSlotController.updateSlot);

export default timeslotRouter;