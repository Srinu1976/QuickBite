const express = require("express");
const {
  createCart,
  getCart,
  createOrUpdateCart,
  updateQuantity,
  deleteCart,
} = require("../controllers/cartController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

// Create Cart
router.post("/", protect, createCart);

// Get single Cart
router.get("/:id", protect, getCart);

// Update or create Single Cart
router.post("/addtocart", protect, createOrUpdateCart);

// Update the quantity
router.put("/quantity", protect, updateQuantity);

// Delete Single Cart
router.delete("/:id", protect, deleteCart);

module.exports = router;
