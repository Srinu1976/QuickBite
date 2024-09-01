const Food = require("../models/foodSchema");
const Category = require("../models/categorySchema"); // Assuming you have a Category model

exports.getAllFoods = async (req, res) => {
  try {
    const user = req.body.userId;
    const { category } = req.query;

    let query = {};

    // Check if category is provided in the query parameters
    if (category) {
      query = { category: { $regex: new RegExp(category, "i") } };
    }

    const foods = await Food.find(query).sort({ createdAt: -1 });

    if (foods.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for the given category" });
    }

    res.status(200).json({ data: foods, message: "Data Received" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error from All" });
  }
};

exports.getFoodByCategory = async (req, res) => {
  try {
    const category = req.params.categoryName;
    console.log(category);
    const foods = await Food.find({
      category,
    }).sort({ createdAt: -1 });

    // const foods = await Food.find({ category });

    if (foods.length === 0 || foods === null) {
      return res
        .status(404)
        .json({ message: "No food found for the given category" });
    }
    res
      .status(200)
      .json({ data: foods, message: "Food items retrieved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to get a specific food item by ID
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.foodId);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    res.json({ data: food, message: "Data Received" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error Get Single Food" });
  }
};

exports.createFood = async (req, res) => {
  const { name, description, price, category, image } = req.body;
  if (image === "" || !image) {
    res.status(404).json({ message: "Please Upload an Image" });
    return;
  }

  try {
    // Check if the provided category exists
    let existingCategory = await Category.findOne({ name: category });

    // If the category does not exist, create a new category
    if (!existingCategory) {
      existingCategory = await Category.create({ name: category });
    }

    // Create the food item
    const newFood = await Food.create({
      name,
      description,
      price,
      category, // Assign the category ID to the food item
      image,
    });
    res.status(201).json({ data: newFood, message: "Item Added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to update a specific food item by ID
exports.updateFoodById = async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(
      req.params.foodId,
      req.body,
      { new: true }
    );
    if (!updatedFood) {
      return res.status(404).json({ message: "Food not found" });
    }
    res.json({ data: updatedFood, message: "Food updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error Update Food" });
  }
};

// Controller to delete a specific food item by ID
exports.deleteFoodById = async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.foodId);
    if (!deletedFood) {
      return res.status(404).json({ message: "Food not found" });
    }
    res.json({ data: deletedFood, message: "Food deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error Delete Food" });
  }
};

// Controller to get top-rated food items
exports.getTopRatedFood = async (req, res) => {
  try {
    const topRatedFoods = await Food.find().sort({ reviews: -1 }).limit(8); // Assuming 'rating' is a field in your FoodSchema
    if (topRatedFoods.length === 0) {
      return res.status(404).json({ message: "No top-rated food found" });
    }
    res
      .status(200)
      .json({ data: topRatedFoods, message: "Top-rated food received" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error from Top-Rated" });
  }
};

// Controller to get new food items
exports.getNewFood = async (req, res) => {
  try {
    const newFoods = await Food.find().sort({ createdAt: -1 }).limit(8); // Assuming 'createdAt' is a field in your FoodSchema indicating the creation date
    if (newFoods.length === 0) {
      return res.status(404).json({ message: "No new food found" });
    }
    res.status(200).json({ data: newFoods, message: "New food received" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error from NewFood" });
  }
};

// Controller to get low-priced food items
exports.getEliteFood = async (req, res) => {
  try {
    const EliteFoods = await Food.find().sort({ price: -1 }).limit(8); // Assuming 'price' is a field in your FoodSchema
    if (EliteFoods.length === 0) {
      return res.status(404).json({ message: "No low-priced food found" });
    }
    res
      .status(200)
      .json({ data: EliteFoods, message: "Low-priced food received" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error from Low Prices" });
  }
};

// Controller to search for food items by keyword
exports.getFoodBySearch = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res
        .status(400)
        .json({ message: "Keyword is required for search" });
    }

    const foods = await Food.find({
      $or: [
        { name: { $regex: new RegExp(keyword, "i") } },
        { description: { $regex: new RegExp(keyword, "i") } },
      ],
    });

    if (foods.length === 0) {
      return res
        .status(404)
        .json({ message: "No food found matching the search criteria" });
    }

    res
      .status(200)
      .json({ data: foods, message: "Food search results received" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error from Food Search" });
  }
};
