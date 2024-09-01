import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/config";
import Avatar from "../assets/images/avatar.jpg";
import updateData from "../hooks/useUpdate";
import deleteData from "../hooks/useDelete";
import { toast } from "react-toastify";

const Admins = () => {
  const useFetch = (url) => {
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
          headers: headers
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
    data: admins,
    loading,
    error,
    fetchData,
  } = useFetch(`${BASE_URL}/user/getAllUsers?role=admin`);

  const handleChangeRole = async (adminId, value) => {
    try {
      // Make the API call to update the role to 'user'
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("Token not found in cookies");
          }

          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          };
      await fetch(`${BASE_URL}/user/updateRoleToUser/${adminId}`, {
        method: "PUT",
        credentials: "include", // Include credentials if needed
        headers: headers,
        body: JSON.stringify({ role: "user" }), // Include the new role value in the request body
      });
      toast.success("Successfully Updated.");
      // Fetch updated user data
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (adminId) => {
    try {
      await deleteData(`${BASE_URL}/user/delete/${adminId}`);
      fetchData(); // Call fetchData directly, no need to pass it as a parameter
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="data-box container-fluid pt-4 ">
      <div className="row align-item-center justify-content-center">
        <h1 className="dashboard-heading">Admins</h1>
        <h5 className="pt-5 mt-3 dashboard-text">All Admins</h5>
        <div className="col-12 table-box">
          <table className="table tours-table shadow">
            <thead>
              <tr>
                <th scope="col" className="text-center">
                  #
                </th>
                <th scope="col">Id</th>
                <th scope="col">Image</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col" className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6}>Loading.......</td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={6}>{error}</td>
                </tr>
              )}
              {!loading &&
                !error &&
                admins?.map((admin, index) => (
                  <tr key={admin._id}>
                    <th scope="row" className="text-center">
                      {index + 1}
                    </th>
                    <td>{admin._id}</td>
                    <td>
                      <img
                        src={admin.photo || Avatar}
                        className="profileimg img-fluid rounded-circle border border-2"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                        alt="profile-img"
                      />
                    </td>
                    <td>{admin.firstName}</td>
                    <td>{admin.email}</td>
                    <td>
                      <select
                        className="form-select form-options"
                        value={admin.role}
                        onChange={(e) =>
                          handleChangeRole(admin._id, e.target.value)
                        }
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-light action-btn"
                        type="button"
                        onClick={() => handleDelete(admin._id)}
                      >
                        <i className="ri-delete-bin-line action-icon delete-icon"></i>
                      </button>
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

export default Admins;
