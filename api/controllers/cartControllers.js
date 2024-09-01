const Cart = require("../models/cartSchema");
const Food = require("../models/foodSchema");

// Controller to get user's cart
const getUserCart = async (req, res) => {
  try {
    // Assuming you have middleware to extract user information from the token and attach it to the request object
    const userId = req.body.userId; // Assuming req.user contains the user information

    const cart = await Cart.findOne({ user: userId })
      .populate("user")
      .populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for the user" });
    }

    res
      .status(200)
      .json({ message: "Cart retrieved successfully", data: cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Controller to add item to cart
const addItemToCart = async (req, res) => {
  try {
    const user = req.body.userId;
    const { items } = req.body;

    let cart = await Cart.findOne({ user });

    // If cart doesn't exist for the user, create a new one
    if (!cart) {
      cart = new Cart({ user, items: [] });
    }

    for (const itemData of items) {
      const { product, quantity, productPrice } = itemData;

      // Fetch the price of the product from the database
      const productDoc = await Food.findById(product);
      if (!productDoc) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === product
      );
      if (existingItemIndex !== -1) {
        // If item exists, update its quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // If item doesn't exist, add it to the cart
        cart.items.push({ product, quantity });
      }

      // Update totalQuantity and totalPrice
      cart.totalQuantity += quantity;
      cart.totalPrice += quantity * productPrice;
    }

    await cart.save();
    res.status(201).json({ data: cart, message: "Added to Cart" });
  } catch (error) {
    res.status(500).json({ message: "Yaya" + error.message });
  }
};

// Controller to remove item from cart
const removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.body.userId;

    let cart = await Cart.findOne({ user: userId });

    // If cart doesn't exist or item doesn't exist in cart, return error
    if (
      !cart ||
      cart.items.findIndex((item) => item.product.toString() === productId) ===
        -1
    ) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Find the removed item
    const removedItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    // If the item exists, remove it from the cart
    if (removedItemIndex !== -1) {
      const removedItem = cart.items.splice(removedItemIndex, 1)[0];
      // Update totalQuantity and totalPrice if item is found
      cart.totalQuantity -= removedItem.quantity;

      // Fetch the price of the product or replace productPrice with the actual price
      const product = await Food.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      cart.totalPrice -= removedItem.quantity * product.price;

      await cart.save();
      return res.json({ message: "Removed from cart", cart });
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to update item quantity in cart
const updateCart = async (req, res) => {
  try {
    const { productId } = req.params; // Corrected: Accessing productId directly from req.params
    const { quantity } = req.body;
    const userId = req.body.userId;

    let cart = await Cart.findOne({ user: userId });

    // If cart doesn't exist or item doesn't exist in cart, return error
    if (
      !cart ||
      cart.items.findIndex((item) => item.product.toString() === productId) ===
        -1
    ) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    // Update the quantity of the item
    const oldQuantity = cart.items[itemIndex].quantity;
    cart.items[itemIndex].quantity = quantity;

    // Update totalQuantity and totalPrice
    cart.totalQuantity += quantity - oldQuantity;
    const productDoc = await Food.findById(cart.items[itemIndex].product);
    cart.totalPrice += (quantity - oldQuantity) * productDoc.price; // Assuming the price is stored in the 'price' field of the 'Food' model

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: `Error from backend ${error.message}` });
  }
};

// Controller to empty cart data of a specific user

const emptyCartByUserID = async (userId) => {
  try {
    // Logic to empty the cart of the user with the provided userId
    // Assuming you have a Cart model/schema
    const cart = await Cart.deleteMany({ userId });
    if (cart) {
      cart.items = []; // Empty the items array
      cart.totalQuantity = 0; // Reset totalQuantity
      cart.totalPrice = 0; // Reset totalPrice
      await cart.save();
    }
    // You can add additional logic if needed
  } catch (error) {
    // Handle errors
    console.error("Error emptying cart:", error);
  }
};

module.exports = {
  getUserCart,
  addItemToCart,
  removeItemFromCart,
  updateCart,
  emptyCartByUserID,
};
