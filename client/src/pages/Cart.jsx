import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/config";
import "../styles/cart.css";
import CartItem from "../shared/CartItem";

import mastercard from "../assets/images/mastercard.png";
import paypal from "../assets/images/AMEX.png";
import cashondelivery from "../assets/images/visa-classic-new-800x450.png";
import jazzcash from "../assets/images/discover.png";
import { toast } from "react-toastify";

const Cart = () => {
  useEffect(() => {
    window.scrollTo(0, -1);
  }, []);

  const { id } = useParams();

  const useInitialFetch = (url) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found in cookies");
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        try {
          const res = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: headers,
          });

          if (!res.ok) {
            throw new Error(
              `Failed to fetch data from ${url}. Status: ${res.status} - ${res.statusText}`
            );
          }

          const result = await res.json();
          setData(result.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [url]);

    return { data, loading, error };
  };

  // Initial loading of userCart data
  const {
    data: userCart,
    loading: cartLoading,
    error: cartError,
  } = useInitialFetch(`${BASE_URL}/cart/${id}`);

  const useFetch2 = (url) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found in cookies");
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: headers,
        });

        if (!res.ok) {
          throw new Error(
            `Failed to fetch data from ${url}. Status: ${res.status} - ${res.statusText}`
          );
        }

        const result = await res.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchData();
    }, [url]); // Only fetch when the URL changes

    return { data, loading, error, setData: fetchData };
  };

  const {
    data: userCartTotal,
    loading: totalLoading,
    error: totalError,
    setData: setUserCart,
  } = useFetch2(`${BASE_URL}/cart/${id}`);

  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [location, setLocation] = useState("");
  const Navigate = useNavigate();

  const handleChange = (e) => {
    setLocation(e.target.value);
  };

  const deleverycharges = userCart.length > 0 ? 1.99 : 0;

  const quantityChanges = () => {
    if (userCartTotal.length !== 0 && !totalLoading && !totalError) {
      // Calculate subtotal
      const calculatedSubtotal = userCartTotal.reduce(
        (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
        0
      );
      setSubtotal(calculatedSubtotal);

      // Calculate total
      const calculatedTotal = calculatedSubtotal + deleverycharges;
      setTotal(calculatedTotal);

      // Trigger the refetch of userCart
      setUserCart([]);
    }
  };

  useEffect(() => {
    // Trigger the refetch of userCart when quantity changes
    quantityChanges();
  }, []);

  useEffect(() => {
    if (userCart.length !== 0 && !cartLoading && !cartError) {
      // Calculate subtotal
      const calculatedSubtotal = userCart.reduce(
        (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
        0
      );
      setSubtotal(calculatedSubtotal);

      // Calculate total
      const calculatedTotal = (calculatedSubtotal + deleverycharges).toFixed(2);
      setTotal(calculatedTotal);
    }
  }, [userCart, cartLoading, cartError]);

  const checkout = async (e) => {
    e.preventDefault();

    const deliveryItem = {
      id: "delivery", // Unique identifier for delivery charges
      price: deleverycharges, // Delivery charges amount
      name: "Delivery Charges", // Name indicating it's for delivery charges
      quantity: 1, // Assuming delivery charges is a fixed amount per order
    };

    const requestBody = {
      items: [
        ...userCart.map((item) => ({
          id: item._id,
          price: item.price,
          name: item.foodName,
          quantity: item.quantity,
        })),
        deliveryItem,
      ],
    };

    try {
      // Send request to initiate checkout
      const res = await fetch(`${BASE_URL}/payment/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify(requestBody),
      });
      // Check if the response is okay
      if (!res.ok) {
        throw new Error(`Failed to initiate checkout: ${res.statusText}`);
      }

      // Parse response data
      const data = await res.json();

      // Check if the response contains the URL for redirection
      if (!data.url) {
        throw new Error("No redirection URL found in the response");
      }

      console.log(data);
      window.location = data.url;
    } catch (error) {
      console.error("Error during checkout:", error.message);
      // Display user-friendly error message
      toast.error("An error occurred during checkout. Please try again later.");
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();

    const userId = id;
    const items = userCart?.map((item) => ({
      product: item.foodId,
      name: item.foodName,
      qty: item.quantity,
    }));
    const shippingAddress = location;
    const totalAmount = total;

    try {
      const response = await fetch(`${BASE_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId, items, shippingAddress, totalAmount }),
      });

      if (!response.ok) {
        toast.error("Server Response is not ok");
      } else {
        const data = await response.json();
        console.log(data);

        const res = await fetch(`${BASE_URL}/cart/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) {
          toast.error("Failed to remove cart items after order");
        }
        Navigate("/thank-you");
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-8 col-12 mt-5 mb-3">
          <h1 className="">Cart</h1>
          <hr />
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="text-center">
                    #
                  </th>
                  <th scope="col">Item</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Total</th>
                  <th scope="col" className="text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      Loading.......
                    </td>
                  </tr>
                ) : cartError ? (
                  <tr>
                    <td colSpan={6} className="text-center text-danger">
                      {cartError}
                    </td>
                  </tr>
                ) : userCart.length !== 0 ? (
                  userCart.map((cart, index) => (
                    <tr key={cart._id}>
                      <th scope="row" className="text-center">
                        {index + 1}
                      </th>
                      <CartItem cart={cart} quantityChanges={quantityChanges} />
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <h3 className="text-center py-3 font-size-5">
                        Cart is Empty
                      </h3>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className={`payment-box shadow d-flex flex-column border border-2 col-lg-4 col-12 mt-5 ${
            userCart.length === 0 ? "disabled" : ""
          }`}
        >
          {userCart.length === 0 && (
            <div className="disabled-overlay">
              <p className="why-disabled">
                Your cart is empty. Add items to proceed.
              </p>
            </div>
          )}
          <h1 className="pt-3 pb-0 mb-0 text-center">Payment</h1>
          <hr />
          <div className="payment-method">
            <h5>Payment Methods</h5>
            <div className="d-flex align-items-center justify-content-center">
              <button className="btn me-1 disabled">
                <img className="img-fluid" src={cashondelivery} alt="" />
              </button>
              <button className="btn me-1 disabled">
                <img className="img-fluid" src={mastercard} alt="" />
              </button>
              <button className="btn me-1 disabled">
                <img className="img-fluid" src={jazzcash} alt="" />
              </button>
              <button className="btn me-1 disabled">
                <img className="img-fluid" src={paypal} alt="" />
              </button>
            </div>
            <hr />
            <form>
              {/* <div className="address-field form-group mb-3">
                <h6>Address:</h6>
                <textarea
                  className="address-input"
                  type="text"
                  placeholder="Address"
                  id="location"
                  onChange={handleChange}
                  required
                />
              </div> */}
              <hr />
              <div className="total">
                <div className="list-group">
                  <div className="list-group-item d-flex justify-content-between border-0 px-0">
                    <h6>SubTotal</h6>
                    <span> £{subtotal}</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between border-0 px-0">
                    <h6>Delivery Charges </h6>
                    <span> £{deleverycharges}</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between border-0 px-0">
                    <h6>Total Amount</h6>
                    <span> £{total}</span>
                  </div>
                </div>
                <button
                  onClick={checkout}
                  className={`${
                    userCart.length === 0 ? "disabled" : ""
                  }checkout-btn px-4 btn w-100 btn-primary flex-grow-1 mb-2 d-flex align-items-center justify-content-between`}
                >
                  <span>£{total}</span>
                  <span>
                    Pay Now<i className="ri-arrow-right-line"></i>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
