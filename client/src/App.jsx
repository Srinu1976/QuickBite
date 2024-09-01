import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import "./App.css";
import { BASE_URL } from "./utils/config.js";
import AdminLayout from "./component/Layout/AdminLayout.jsx";
import ClientLayout from "./component/Layout/ClientLayout.jsx";
import Spinner from "./component/Spinner.jsx";

function App() {
  const { user } = useContext(AuthContext);

  const useFetch = (url) => {
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
            headers: headers
          });

          if (!res.ok) {
            throw new Error(
              `Failed to fetch data from ${url}. Status: ${res.status} - ${res.statusText}`
            );
          }

          const result = await res.json()
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

  const userId = user?._id || "";

  const {
    data: userData,
    loading,
    error,
  } = useFetch(`${BASE_URL}/user/getUser/${userId}`);

return (
  <div>
    {loading ? (
      <Spinner />
    ) : userData.role === "admin" ? (
      <AdminLayout />
    ) : (
      <ClientLayout />
    )}
  </div>
);
}

export default App;
