const Feedback = require("../models/feedback");

// Controller to handle feedback submission
const submitFeedback = async (req, res) => {
  try {
    // Extract form data from request body
    const { name, email, feedback } = req.body;

    // Validate form data (you can use any validation library like express-validator)
    if (!name || !email || !feedback) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Save feedback to database (assuming you have a Feedback model/schema)
    const feeedback = new Feedback({ name, email, feedback });
    await feeedback.save();

    // Send response
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to get all feedback submissions
const getAllFeedback = async (req, res) => {
  try {
    // Fetch all feedback submissions from the database
    const feedbackList = await Feedback.find();

    // Send response with the list of feedback submissions
    res.status(200).json({ data: feedbackList });
  } catch (error) {
    // Handle errors
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { submitFeedback, getAllFeedback };
