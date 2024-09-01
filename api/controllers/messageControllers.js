const Contact = require("../models/message");

// Controller to handle contact message submission
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save contact message to database
    const contactMessage = new Contact({ name, email, message });
    await contactMessage.save();

    // Send response
    res.status(201).json({ message: "Message submitted successfully" });
  } catch (error) {
    console.error("Error submitting contact message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to retrieve all contact messages
const getAllContactMessages = async (req, res) => {
  try {
    // Fetch all contact messages from database
    const contactMessages = await Contact.find();

    // Send response
    res.status(200).json({ data: contactMessages });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { submitContactMessage, getAllContactMessages };
