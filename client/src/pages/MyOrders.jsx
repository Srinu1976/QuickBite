import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../utils/config";
import "../styles/my-account.css";
import "../styles/my-order.css";

const MyOrders = () => {
  useEffect(() => {
    window.scrollTo(0, -1);
  }, []);

  const { id } = useParams();

  const fetchOrder = (url) => {
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
  const {
    data: userOrders,
    loading,
    error,
  } = fetchOrder(`${BASE_URL}/order/ordersbyid/${id}`);
  console.log(userOrders);
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mt-3 mb-3 d-flex justify-content-between align-items-center">
          <h1 className="text-center">My Orders</h1>
          <h4>Orders ( {userOrders.length || 0} )</h4>
        </div>
        <div className="col-12 mb-3 table-responsive">
          <table className="table order-table">
            <thead>
              <tr className="text-center">
                <th scope="col" className="text-center">
                  #
                </th>
                <th scope="col">Types of Items</th>
                <th scope="col">Date & Time</th>
                <th scope="col">Total Amout</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {userOrders.length !== 0 ? (
                loading ? (
                  <tr>
                    <td colSpan={6}>Loading.......</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6}>{error}</td>
                  </tr>
                ) : (
                  userOrders.map((order, index) => (
                    <tr key={order._id} className="text-center">
                      <th scope="row" className="text-center">
                        {index + 1}
                      </th>
                      <td>{order?.products?.length}</td>
                      <td>
                        {(() => {
                          const createdAtDate = new Date(order.createdAt);
                          const formattedDate = createdAtDate.toDateString();
                          const options = {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          };
                          const time = createdAtDate.toLocaleTimeString(
                            "en-US",
                            options
                          );

                          return `${formattedDate} - ${time}`;
                        })()}
                      </td>
                      <td>{order?.totalAmount}</td>
                      <td>
                        {order.status === "pending" ? (
                          <div className="status preparing rounded-2 mx-auto">
                            Pending
                          </div>
                        ) : order.status === "delivered" ? (
                          <div className="status delivered rounded-2 mx-auto">
                            Delivered
                          </div>
                        ) : order.status === "cancelled" ? (
                          <div className="status cancelled rounded-2 mx-auto">
                            Cancelled
                          </div>
                        ) : order.status === "delivering" ? (
                          <div className="status delivering rounded-2 mx-auto">
                            Delivering
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan={6}>
                    <h3 className="text-center py-3 font-size-5">
                      No orders found
                    </h3>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
