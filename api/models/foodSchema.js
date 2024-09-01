// FoodSchema.js
const mongoose = require("mongoose");

const Category = require("./categorySchema"); // Import the Category model

const ReviewSchema = new mongoose.Schema({
  user: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const FoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, ref: "Category" }, // Reference to Category model
    price: { type: String, required: true, min: 0 },
    image: { type: String, required: true },
    reviews: [ReviewSchema],
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.model("Food", FoodSchema);

module.exports = Food;
