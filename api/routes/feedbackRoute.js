// feedbackRoutes.js

const express = require("express");
const router = express.Router();
const {
  submitFeedback,
  getAllFeedback,
} = require("../controllers/feedbackController");

// POST route for submitting feedback
router.post("/", submitFeedback);
router.get("/", getAllFeedback);

module.exports = router;
