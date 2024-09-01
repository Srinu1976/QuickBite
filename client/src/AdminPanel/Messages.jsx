import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/config";
import Avatar from "../assets/images/avatar.jpg";
import updateData from "../hooks/useUpdate";
import deleteData from "../hooks/useDelete";

const Users = () => {
  const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
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
    }, [url]);

    return { data, loading, error, fetchData };
  };

  const {
    data: users,
    loading,
    error,
    fetchData,
  } = useFetch(`${BASE_URL}/message`);
  console.log(users);
  const [usersWithOrderCounts, setUsersWithOrderCounts] = useState([]);

  useEffect(() => {
    const fetchUsersWithOrderCounts = async () => {
      try {
        const usersWithCounts = await Promise.all(
          users.map(async (user) => {
            const count = await orderCount(user._id);
            return { ...user, orderCount: count };
          })
        );
        setUsersWithOrderCounts(usersWithCounts);
      } catch (err) {
        console.error(`Failed to fetch order counts for users: ${err.message}`);
      }
    };

    if (users.length > 0) {
      fetchUsersWithOrderCounts();
    }
  }, [users]);

  const orderCount = async (userId) => {
    try {
      const res = await fetch(`${BASE_URL}/message`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(
          `Failed to fetch data. Status: ${res.status} - ${res.statusText}`
        );
      }

      const result = await res.json();
      return result.data.length;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="data-box container-fluid pt-4">
      <div className="row align-item-center justify-content-center">
        <h1 className="dashboard-heading">Messages</h1>
        <h5 className="pt-5 mt-3 dashboard-text">All Messages</h5>
        <div className="col-12 table-box">
          <table className="table tours-table shadow">
            <thead>
              <tr>
                <th scope="col" className="text-center">
                  #
                </th>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Message</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7}>Loading.......</td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={7}>{error}</td>
                </tr>
              )}
              {!loading &&
                !error &&
                usersWithOrderCounts?.map((user, index) => (
                  <tr key={user._id}>
                    <th scope="row" className="text-center">
                      {index + 1}
                    </th>
                    <td>{user._id}</td>

                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.message}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
