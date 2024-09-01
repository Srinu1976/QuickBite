import React, { useState } from "react";
import { BASE_URL } from "../utils/config";
import { toast } from "react-toastify";

const CartItem = ({ cart, quantityChanges }) => {
  const { _id, userId, foodId, photo, foodName, price, quantity } = cart;
  const [newQuantity, setNewQuantity] = useState(quantity);
  const deleveryCharges = 1.99;
  const total = (price * newQuantity + deleveryCharges).toFixed(2);

  const handleQuantityChange = async (action) => {
    try {
      let updatedQuantity;

      if (action === "increase") {
        updatedQuantity = newQuantity + 1;
      } else if (action === "decrease" && newQuantity > 1) {
        updatedQuantity = newQuantity - 1;
      } else {
        return;
      }

      const cartItem = {
        userId: userId,
        foodId: foodId,
        quantity: updatedQuantity,
      };
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in cookies");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(`${BASE_URL}/cart/quantity`, {
        method: "PUT",
        headers: headers,
        credentials: "include",
        body: JSON.stringify(cartItem),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to update item quantity");
      } else {
        setNewQuantity(updatedQuantity);
        quantityChanges();
      }
    } catch (err) {
      toast.error("Error during updating the quantity");
      console.log(err);
    }
  };

  const handleManualQuantityChange = async (e) => {
    try {
      const enteredValue = parseInt(e.target.value, 10);
      if (!isNaN(enteredValue) && enteredValue > 0) {
        setNewQuantity(enteredValue);

        const cartItem = {
          userId: userId,
          foodId: foodId,
          quantity: enteredValue,
        };
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found in cookies");
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await fetch(`${BASE_URL}/cart/quantity`, {
          method: "PUT",
          headers: headers,
          credentials: "include",
          body: JSON.stringify(cartItem),
        });

        const result = await response.json();

        if (!response.ok) {
          return toast.error(
            result.message || "Failed to add item to the cart"
          );
        }
        quantityChanges();
      } else {
        // If the entered value is not a positive number, reset to 1
        setNewQuantity(1);
      }
    } catch (err) {
      toast.error("Error during updating the quantity");
      console.log(err);
    }
  };

  const handleRemove = async (_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in cookies");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(`${BASE_URL}/cart/${_id}`, {
        method: "DELETE",
        credentials: "include",
        headers: headers,
      });

      const { message } = await response.json();

      if (!response.ok) {
        toast.error(message);
        return;
      }
      toast.info("Removed the item from the cart.");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      toast.error("Error during deletion.");
      console.log(err);
    }
  };

  return (
    <>
      <td className="item-column">
        <img
          className="cart-item-img img-fluid rounded-2 me-3"
          src={`/uploads/${photo}`}
          alt=""
        />
        {foodName}
      </td>
      <td>£{price}</td>
      <td>
        <div className="quantity d-flex align-items-center justify-content-between">
          <div className="input-group w-auto justify-content-end align-items-center justify-content-center">
            <input
              type="button"
              value="-"
              className="button-minus border rounded-circle  icon-shape icon-sm  "
              onClick={() => handleQuantityChange("decrease", _id)}
            />
            <input
              type="number"
              step="1"
              value={newQuantity}
              name="quantity"
              onBlur={handleManualQuantityChange}
              onChange={(e) => setNewQuantity(e.target.value)}
              className="quantity-field border-0 text-center w-25 mx-1"
            />
            <input
              type="button"
              value="+"
              className="button-plus border rounded-circle icon-shape icon-sm lh-0"
              onClick={() => handleQuantityChange("increase", _id)}
            />
          </div>
        </div>
      </td>
      <td>£{total}</td>

      <td className="text-center">
        <button
          type="button"
          className="remove-btn btn btn-danger"
          onClick={() => handleRemove(_id)}
        >
          <i className="ri-delete-bin-line"></i>
        </button>
      </td>
    </>
  );
};

export default CartItem;
