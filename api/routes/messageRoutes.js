const express = require("express");
const router = express.Router();
const {
  submitContactMessage,
  getAllContactMessages,
} = require("../controllers/messageControllers");

// Route to submit contact message
router.post("/", submitContactMessage);

// Route to retrieve all contact messages
router.get("/", getAllContactMessages);

module.exports = router;
