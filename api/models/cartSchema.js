// const mongoose = require("mongoose");

// const cartSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     items: [
//       {
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Food",
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//           default: 1,
//           min: 1,
//         },
//       },
//     ],
//     totalQuantity: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     totalPrice: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Cart = mongoose.model("Cart", cartSchema);

// module.exports = Cart;
