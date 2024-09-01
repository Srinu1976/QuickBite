const express = require("express");
const router = express.Router();
const {
  getUserCart,
  addItemToCart,
  removeItemFromCart,
  updateCart,
  emptyCartByUserID,
} = require("../controllers/cartControllers");
const { protect } = require("../middleware/authMiddleware");

// GET user's cart
router.get("/", protect, getUserCart);

// POST add item to cart
router.post("/add", protect, addItemToCart);

router.put("/update/:productId", protect, updateCart);
// DELETE remove item from cart
router.delete("/remove/:productId", protect, removeItemFromCart);
router.delete("/delete", emptyCartByUserID);

module.exports = router;
