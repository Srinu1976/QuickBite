// CategorySchema.js

const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  category: { type: String },
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
