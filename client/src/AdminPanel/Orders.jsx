import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/config";
import { toast } from "react-toastify";
import updateData from "../hooks/useUpdate";

const Orders = () => {
  const [status, setStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsername = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in cookies");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const res = await fetch(`${BASE_URL}/user/getUser/${userId}`, {
        method: "GET",
        credentials: "include",
        headers: headers,
      });

      if (!res.ok) {
        throw new Error(
          `Failed to fetch data. Status: ${res.status} - ${res.statusText}`
        );
      }

      const result = await res.json();
      return result.data.firstName;
    } catch (err) {
      console.error(err);
    }
  };

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
      const ordersResponse = await fetch(`${BASE_URL}/order?status=${status}`, {
        method: "GET",
        credentials: "include",
        headers: headers,
      });

      if (!ordersResponse.ok) {
        throw new Error(
          `Failed to fetch orders. Status: ${ordersResponse.status} - ${ordersResponse.statusText}`
        );
      }

      const ordersData = await ordersResponse.json();

      const userInfoPromises = ordersData.data.map(async (order) => {
        const firstName = await fetchUsername(order.user._id);
        return { ...order, firstName };
      });

      const updatedOrders = await Promise.all(userInfoPromises);
      setOrders(updatedOrders);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [status]);

  const handleAction = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in cookies");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(`${BASE_URL}/order/orders/${orderId}`, {
        method: "PUT",
        headers: headers,
        credentials: "include",
        body: JSON.stringify({ status: newStatus.toLowerCase() }),
      });

      const { message } = await response.json();

      if (!response.ok) {
        toast.error(message);
        return;
      }

      toast.success("Successfully Updated.");
      setTimeout(() => {
        fetchData();
      }, 1000);
    } catch (err) {
      toast.error("Error during updating.");
      console.error(err);
    }
  };

  const handlePayment = (orderId, value) => {
    updateData(`${BASE_URL}/order/paymnet/${orderId}`, "payment", value);
    setTimeout(() => {
      fetchData();
    }, 1000);
  };

  return (
    <div className="data-box container-fluid pt-4">
      <div className="row align-item-center justify-content-center">
        <h1 className="dashboard-heading">Orders</h1>
        <div className="d-flex align-item-center justify-content-between pt-5 flex-column flex-sm-row">
          <div className="mt-3">
            <h5 className="dashboard-text">All Orders</h5>
          </div>
          <div className="d-flex gap-1 mb-1 align-items-end">
            <button
              className={`filter-btn btn btn-light ${
                status === "" ? "active" : ""
              }`}
              onClick={() => {
                setStatus("");
              }}
            >
              All
            </button>
            <button
              className={`filter-btn btn btn-light ${
                status === "pending" ? "active" : ""
              }`}
              onClick={() => {
                setStatus("pending");
              }}
            >
              Pending
            </button>
            <button
              className={`filter-btn btn btn-light ${
                status === "processing" ? "active" : ""
              }`}
              onClick={() => {
                setStatus("processing");
              }}
            >
              Processing
            </button>
            <button
              className={`filter-btn btn btn-light ${
                status === "cancelled" ? "active" : ""
              }`}
              onClick={() => {
                setStatus("cancelled");
              }}
            >
              Cancelled
            </button>
            <button
              className={`filter-btn btn btn-light ${
                status === "completed" ? "active" : ""
              }`}
              onClick={() => {
                setStatus("completed");
              }}
            >
              Completed
            </button>
          </div>
        </div>
        <div className="col-12 table-responsive">
          <table className="table table-box tours-table shadow">
            <thead>
              <tr>
                <th scope="col" className="text-center">
                  #
                </th>
                <th scope="col">FirstName</th>
                <th scope="col">Items</th>
                <th scope="col">Address</th>
                <th scope="col">Total</th>
                <th scope="col">Payment</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={9}>Loading.......</td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={9}>{error}</td>
                </tr>
              )}
              {!loading &&
                !error &&
                orders?.map((order, index) => (
                  <tr key={order._id}>
                    <th scope="row" className="text-center">
                      {index + 1}
                    </th>
                    <td>{order.firstName}</td>
                    <td>{order?.products?.length}</td>
                    <td>{order.shippingAddress}</td>
                    <td>{order.totalAmount}</td>
                    <td>
                      <select
                        className="form-select"
                        value={order.payment ? "yes" : "no"}
                        onChange={(e) =>
                          handlePayment(order._id, e.target.value)
                        }
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                    <td className="text-uppercase">{order.status}</td>
                    <td className="text-center">
                      {order.status === "pending" ? (
                        <>
                          <button
                            className="btn btn-light action-btn"
                            onClick={() =>
                              handleAction(order?._id, "processing")
                            }
                            type="button"
                          >
                            <i className="ri-truck-line action-icon"></i>
                          </button>
                          &nbsp; / &nbsp;
                          <button
                            className="btn btn-light action-btn"
                            onClick={() =>
                              handleAction(order?._id, "cancelled")
                            }
                            type="button"
                          >
                            <i className="ri-close-line action-icon"></i>
                          </button>
                        </>
                      ) : order.status === "processing" ? (
                        <>
                          <button
                            className="btn btn-light action-btn"
                            onClick={() =>
                              handleAction(order?._id, "completed")
                            }
                            type="button"
                          >
                            <i className="ri-check-line action-icon"></i>
                          </button>
                          &nbsp; / &nbsp;
                          <button
                            className="btn btn-light action-btn"
                            onClick={() =>
                              handleAction(order?._id, "cancelled")
                            }
                            type="button"
                          >
                            <i className="ri-close-line action-icon"></i>
                          </button>
                        </>
                      ) : null}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
