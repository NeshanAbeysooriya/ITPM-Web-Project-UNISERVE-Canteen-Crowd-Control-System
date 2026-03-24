import express from "express";
import {
    createFeedback,
    getAllFeedback,
    getFeedbackById,
    updateFeedback,
    deleteFeedback
} from "../controllers/feedbackController.js";

const feedbackRouter = express.Router();

feedbackRouter.post("/", createFeedback);
feedbackRouter.get("/", getAllFeedback);
feedbackRouter.get("/:id", getFeedbackById);
feedbackRouter.put("/:id", updateFeedback);
feedbackRouter.delete("/:id", deleteFeedback);

export default feedbackRouter;