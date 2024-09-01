const Order = require("../models/orderSchema");
const { emptyCartByUserID } = require("../controllers/cartControllers");

exports.createOrder = async (req, res) => {
  const { userId, items, totalAmount, shippingAddress } = req.body;
  try {
    const order = new Order({
      user: userId,
      products: items,
      totalAmount,
      shippingAddress,
    });

    await order.save();

    await emptyCartByUserID(userId);

    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to create order",
      error: error.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const status = req.query.status;

    const filter = status ? { status } : {};

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("products.product");
    res.status(200).json({
      status: "success",
      message: "All orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};
exports.getOrdersById = async (req, res) => {
  try {
    const user = req.params.id;
    const orders = await Order.find({ user }).sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      message: "All orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

exports.getSingleOrder = async (req, res) => {
  const _id = req.params.id;

  try {
    const order = await Order.findById(_id);
    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

exports.getDeliveredOrders = async (req, res) => {
  try {
    const deliveredOrders = await Order.find({ status: "completed" });
    res.status(200).json({
      status: "success",
      message: "Delivered orders fetched successfully",
      data: deliveredOrders,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch delivered orders",
      error: error.message,
    });
  }
};

exports.updateOrder = async (req, res) => {
  const orderId = req.params.id; // Extract the order ID from request params
  const updatedData = req.body; // Extract updated data from request body

  try {
    // Find the order by ID
    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found",
      });
    }

    // Check if the 'status' field exists in the updatedData
    if (!updatedData.hasOwnProperty("status")) {
      return res.status(400).json({
        status: "fail",
        message: "Status field is required for updating the order",
      });
    }

    // Update the order with the received status
    order.status = updatedData.status;
    await order.save();

    // Return success response with updated order data
    res.status(200).json({
      status: "success",
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      status: "error",
      message: "Failed to update order",
      error: error.message,
    });
  }
};
