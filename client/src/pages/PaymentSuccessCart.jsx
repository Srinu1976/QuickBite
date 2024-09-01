import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/config";
import "../styles/cart.css";
import CartItem from "../shared/CartItem";
import { postcodes } from "../utils/postcodes";
import { toast } from "react-toastify";

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#90E051",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

const PaymentSuccessCart = () => {
  useEffect(() => {
    window.scrollTo(0, -1);
  }, []);

  const data = localStorage.getItem("user");
  const userData = JSON.parse(data);
  const id = userData._id;
  const allPostcodes = postcodes.map((postcode) => postcode.postcode);

  // Log the new array containing all postcodes
  console.log(allPostcodes);

  const useInitialFetch = (url) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
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
  const [showModal, setShowModal] = useState(false);

  const handleCheckDelivery = () => {
    // Logic to check delivery area can go here
    // For now, we'll directly show the modal
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setLocation(e.target.value);
  };

  const deleverycharges = 1.99;

  const quantityChanges = () => {
    if (userCartTotal.length !== 0 && !totalLoading && !totalError) {
      // Calculate subtotal
      const calculatedSubtotal = userCartTotal.reduce(
        (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
        0
      );
      setSubtotal(calculatedSubtotal);

      // Calculate total
      const calculatedTotal = (calculatedSubtotal + deleverycharges).toFixed(2);
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
      const calculatedTotal = calculatedSubtotal + deleverycharges;
      setTotal(calculatedTotal);
    }
  }, [userCart, cartLoading, cartError]);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!location) {
      toast.info("The address is required");
      return false;
    }
    if (!postcode) {
      toast.info("The postcode is required");
      return false;
    }
    const userId = id;
    const items = userCart?.map((item) => ({
      product: item.foodId,
      name: item.foodName,
      qty: item.quantity,
    }));
    const shippingAddress = location;
    const totalAmount = total;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in cookies");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(`${BASE_URL}/order`, {
        method: "POST",
        headers: headers,
        credentials: "include",
        body: JSON.stringify({ userId, items, shippingAddress, totalAmount }),
      });

      if (!response.ok) {
        toast.error("Server Response is not ok");
      } else {
        const data = await response.json();

        const res = await fetch(`${BASE_URL}/cart/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers: headers,
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

  const [activeTab, setActiveTab] = useState(0);
  const [postcode, setPostcode] = useState("");
  const [postcodeValid, setPostcodeValid] = useState(false); // State to track if postcode is a string

  const handlePostcodeChange = (e) => {
    const value = e.target.value;
    setPostcode(value);
    setPostcodeValid(allPostcodes.includes(value));
  };

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  return (
    <>
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
                        <CartItem
                          cart={cart}
                          quantityChanges={quantityChanges}
                        />
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
              <span>
                <i
                  style={{ fontSize: "4rem", color: "green" }}
                  className="d-flex justify-content-center ri-checkbox-circle-line"
                ></i>
              </span>
              <hr />
              <div className="your-order-container">
                <h3>YOUR ORDER</h3>
                <h5>Store opens at 03:45 pm</h5>

                <div>
                  {/* Tabs */}
                  <div style={{ display: "flex", width: "100%" }}>
                    <div
                      style={{
                        flex: "1",
                        height: "70px",
                        padding: "10px",
                        cursor: "pointer",
                        textAlign: "center",
                        border: "1px solid black",
                        backgroundColor:
                          activeTab === 0 ? "#90E051" : "transparent",
                      }}
                      onClick={() => handleTabChange(0)}
                    >
                      Home Delivery
                      <p style={{ fontSize: "15px" }}>Starts at: 04:30 pm</p>
                    </div>
                    <div
                      style={{
                        flex: "1",
                        cursor: "pointer",
                        height: "70px",
                        padding: "10px",
                        textAlign: "center",

                        border: "1px solid black",
                        backgroundColor:
                          activeTab === 1 ? "#90E051" : "transparent",
                      }}
                      onClick={() => handleTabChange(1)}
                    >
                      Collection
                      <p style={{ fontSize: "15px" }}>Starts at : 04:00 pm</p>
                    </div>
                  </div>

                  {/* Tabs content */}
                  <div style={{ margin: "10px 0" }}>
                    {activeTab === 0 && (
                      <div>
                        <p>Enter Delivery PostCode</p>
                        <input
                          value={postcode}
                          onChange={handlePostcodeChange}
                          type="text"
                          placeholder="Enter Postcode"
                          style={{
                            border: "1px solid black",
                            borderRadius: "4px",

                            padding: "15px 10px",
                            width: "100%",
                          }}
                        />
                        <button
                          onClick={handleCheckDelivery}
                          disabled={!postcodeValid}
                          style={{
                            backgroundColor: "#90E051",
                            width: "80%",
                            height: "50px",
                            marginTop: "20px",

                            border: "none",
                            borderRadius: "10px",
                          }}
                        >
                          CHECK DELIVERY
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    {activeTab === 1 && (
                      <div>
                        <p>Collection Time</p>
                        <div style={{ width: "100%" }}>
                          <select
                            style={{
                              width: "100%",
                              height: "30px",
                              padding: "0 5px",
                            }}
                          >
                            <option>04:00 PM (Friday)</option>
                            <option>04:15 PM (Friday)</option>
                            <option>04:30 PM (Friday)</option>
                            <option>04:45 PM (Friday)</option>
                            <option>05:00 PM (Friday)</option>
                            <option>05:15 PM (Friday)</option>
                            <option>05:30 PM (Friday)</option>
                            <option>05:45 PM (Friday)</option>
                            <option>06:00 PM (Friday)</option>
                            <option>06:15 PM (Friday)</option>
                            <option>06:30 PM (Friday)</option>
                            <option>06:45 PM (Friday)</option>
                            <option>07:00 PM (Friday)</option>
                            <option>07:15 PM (Friday)</option>
                            <option>07:30 PM (Friday)</option>
                            <option>07:45 PM (Friday)</option>
                            <option>08:00 PM (Friday)</option>
                            <option>08:15 PM (Friday)</option>
                            <option>08:30 PM (Friday)</option>
                            <option>08:45 PM (Friday)</option>
                            <option>09:00 PM (Friday)</option>
                            <option>09:15 PM (Friday)</option>
                            <option>09:30 PM (Friday)</option>
                            <option>09:45 PM (Friday)</option>
                            <option>10:00 PM (Friday)</option>
                            <option>10:15 PM (Friday)</option>
                            <option>10:30 PM (Friday)</option>
                            <option>10:45 PM (Friday)</option>
                            <option>11:00 PM (Friday)</option>
                            <option>11:15 PM (Friday)</option>
                            <option>11:30 PM (Friday)</option>
                            <option>11:45 PM (Friday)</option>
                            <option>12:00 AM (Saturday)</option>
                            <option>12:15 AM (Saturday)</option>
                            <option>12:30 AM (Saturday)</option>
                            <option>12:45 AM (Saturday)</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <hr />
              <form>
                <div className="address-field form-group mb-3">
                  <h6>Address:</h6>
                  <textarea
                    className="address-input"
                    type="text"
                    placeholder="Address"
                    id="location"
                    onChange={handleChange}
                    required
                  />
                </div>
                <hr />
                <div className="total">
                  <div className="list-group">
                    <div className="list-group-item d-flex justify-content-between border-0 px-0">
                      <h6>SubTotal</h6>
                      <span> €{subtotal}</span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between border-0 px-0">
                      <h6>Delivery Charges </h6>
                      <span> €{deleverycharges}</span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between border-0 px-0">
                      <h6>Total Amount</h6>
                      <span> €{total}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleOrder}
                    className={`${
                      userCart.length === 0 ? "disabled" : ""
                    }checkout-btn px-4 btn w-100 btn-primary flex-grow-1 mb-2 d-flex align-items-center justify-content-center`}
                  >
                    <span>
                      Confirm Order<i className="ri-arrow-right-line"></i>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <p>No Home Delivery to this area</p>
            <button onClick={handleCloseModal} style={modalStyles.button}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentSuccessCart;
