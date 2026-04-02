import express from "express";
import * as timeSlotController from "../controllers/timeSlotController.js";

const router = express.Router();

/**
 * Vendor creates a new time slot
 * Route: POST /api/slots/create
 */
router.post("/create", timeSlotController.createSlot);

/**
 * Get all slots
 * Route: GET /api/slots
 */
router.get("/", timeSlotController.getSlots);

/**
 * Student books a slot
 * Route: POST /api/slots/book
 */
router.post("/book", timeSlotController.bookSlot);

/**
 * Vendor updates slot (capacity or status)
 * Route: PATCH /api/slots/update
 */
router.patch("/update", timeSlotController.updateSlot);

export default router;