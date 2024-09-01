// foodRoutes.js

const express = require("express");
const router = express.Router();
const {
  getAllFoods,
  getFoodById,
  createFood,
  updateFoodById,
  deleteFoodById,
  getNewFood,
  getTopRatedFood,
  getEliteFood,
  getFoodBySearch,
  getFoodByCategory,
} = require("../controllers/foodController");
const { protect, verifyAdmin } = require("../middleware/authMiddleware");

// Get all food items
router.get("/", getAllFoods);

// Get a specific food item by ID
router.get("/foods/:foodId", getFoodById);

router.get("/search", getFoodBySearch);

router.get("/top-rated", getTopRatedFood);

// New route for low-priced foods
router.get("/elite", getEliteFood);

router.get("/new", getNewFood);

// Create a new food item
router.post("/create", createFood);

// Update a specific food item by ID
router.put("/:foodId", protect, verifyAdmin, updateFoodById);

// Delete a specific food item by ID
router.delete("/:foodId", protect, verifyAdmin, deleteFoodById);

// route for getting food items by category
router.get("/category/:categoryName", getFoodByCategory);

module.exports = router;
