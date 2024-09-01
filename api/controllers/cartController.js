const Cart = require("../models/Cart");

// Create new Cart
exports.createCart = async (req, res) => {
  try {
    const {
      userId,
      userEmail,
      foodId,
      foodName,
      quantity,
      phone,
      price,
      category,
      location,
    } = req.body;

    if (
      !userId ||
      !userEmail ||
      !foodName ||
      !quantity ||
      !phone ||
      !price ||
      !category ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields for Cart.",
      });
    }

    const newCart = new Cart({
      userId,
      userEmail,
      quantity,
      foodName,
      price,
      phone,
      category,
      location,
    });

    const savedCart = await newCart.save();

    res.status(200).json({
      success: true,
      message: "Your tour is booked",
      data: savedCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get single Cart
exports.getCart = async (req, res) => {
  const id = req.params.id;
  try {
    const cart = await Cart.find({ userId: id });
    res.status(200).json({
      success: true,
      message: "Successful",
      data: cart,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Not found",
    });
  }
};

// Create new Cart or update existing one
exports.createOrUpdateCart = async (req, res) => {
  try {
    const { userId, foodId, foodName, quantity, photo, price, category } =
      req.body;
    // Check if the item already exists in the cart
    const existingCart = await Cart.findOne({ userId, foodId });

    if (existingCart) {
      // Item exists, update quantity
      const updatedQuantity = existingCart.quantity + quantity;

      const updatedCart = await Cart.findOneAndUpdate(
        { userId, foodId },
        { quantity: updatedQuantity },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Cart item quantity updated successfully",
        data: updatedCart,
      });
    } else {
      // Item doesn't exist, create a new cart entry
      const newCart = new Cart({
        userId,
        foodId,
        foodName,
        quantity,
        price,
        photo,
        category,
      });

      const savedCart = await newCart.save();

      return res.status(200).json({
        success: true,
        message: "Cart item added successfully",
        data: savedCart,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { userId, foodId, quantity } = req.body;

    const updatedCart = await Cart.findOneAndUpdate(
      { userId, foodId },
      { quantity: quantity },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Cart item quantity updated successfully",
      data: updatedCart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete all Carts by user ID
exports.deleteCart = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedCarts = await Cart.findOneAndDelete(id);

    if (deletedCarts.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No cart items found for the given user ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "All cart items removed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
