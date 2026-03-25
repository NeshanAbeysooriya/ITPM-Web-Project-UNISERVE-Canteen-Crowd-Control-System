import Feedback from "../models/feedback.js";
import { isAdmin } from "./userController.js";


// ✅ CREATE FEEDBACK (Now supports guest + logged user)
export function createFeedback(req, res) {

    const feedback = new Feedback({
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        menuName: req.body.menuName,
        rating: req.body.rating,
        comment: req.body.comment,
        userId: req.user ? req.user._id : null
    });

    feedback.save().then(
        () => {
            res.json({
                message: "Feedback created successfully"
            });
        }
    ).catch(
        (error) => {
            res.status(500).json({
                message: "Failed to create feedback",
                error: error.message
            });
        }
    );
}

export function getAllFeedback(req, res) {

    Feedback.find()
        .populate("userId", "firstName lastName email")
        .then(
            (feedbacks) => {
                res.json(feedbacks);
            }
        )
        .catch(
            () => {
                res.status(500).json({
                    message: "Failed to get feedbacks"
                });
            }
        );
}

export function getFeedbackById(req, res) {

    Feedback.findById(req.params.id)
        .populate("userId", "firstName lastName email")
        .then(
            (feedback) => {

                if (feedback == null) {
                    res.status(404).json({
                        message: "Feedback not found"
                    });
                    return;
                }

                res.json(feedback);
            }
        )
        .catch(
            () => {
                res.status(500).json({
                    message: "Failed to get feedback"
                });
            }
        );
}

export function updateFeedback(req, res) {

    Feedback.findById(req.params.id)
        .then(
            (feedback) => {

                if (feedback == null) {
                    res.status(404).json({
                        message: "Feedback not found"
                    });
                    return;
                }

                // If feedback has a user → check ownership
                if (feedback.userId && req.user) {
                    if (feedback.userId.toString() !== req.user._id.toString()) {
                        res.status(403).json({
                            message: "Not authorized to update this feedback"
                        });
                        return;
                    }
                }

                Feedback.updateOne(
                    { _id: req.params.id },
                    {
                        fullName: req.body.fullName,
                        email: req.body.email,
                        phone: req.body.phone,
                        menuName: req.body.menuName,
                        rating: req.body.rating,
                        comment: req.body.comment
                    }
                ).then(
                    () => {
                        res.json({
                            message: "Feedback updated successfully"
                        });
                    }
                ).catch(
                    () => {
                        res.status(500).json({
                            message: "Failed to update feedback"
                        });
                    }
                );

            }
        )
        .catch(
            () => {
                res.status(500).json({
                    message: "Error finding feedback"
                });
            }
        );
}

export function deleteFeedback(req, res) {

    Feedback.findById(req.params.id)
        .then(
            (feedback) => {

                if (feedback == null) {
                    res.status(404).json({
                        message: "Feedback not found"
                    });
                    return;
                }

                // Allow delete if:
                // 1. Owner
                // 2. Admin
                // 3. Guest feedback (no userId)
                if (
                    feedback.userId &&
                    req.user &&
                    feedback.userId.toString() !== req.user._id.toString() &&
                    !isAdmin(req)
                ) {
                    res.status(403).json({
                        message: "Not authorized to delete this feedback"
                    });
                    return;
                }

                Feedback.deleteOne({ _id: req.params.id })
                    .then(
                        () => {
                            res.json({
                                message: "Feedback deleted successfully"
                            });
                        }
                    )
                    .catch(
                        () => {
                            res.status(500).json({
                                message: "Failed to delete feedback"
                            });
                        }
                    );

            }
        )
        .catch(
            () => {
                res.status(500).json({
                    message: "Error finding feedback"
                });
            }
        );
}