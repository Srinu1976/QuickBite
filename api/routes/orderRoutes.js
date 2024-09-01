const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect, verifyAdmin } = require("../middleware/authMiddleware");

router.post("/", protect, orderController.createOrder);
router.get("/", protect, verifyAdmin, orderController.getAllOrders);
router.get("/orders/:id", protect, orderController.getSingleOrder);
router.put("/orders/:id", protect, orderController.updateOrder);
router.get("/ordersbyid/:id", protect, orderController.getOrdersById);
router.get("/delivered", protect, orderController.getDeliveredOrders);

module.exports = router;
