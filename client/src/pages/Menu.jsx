import React, { useEffect, useState } from "react";
import "../styles/menu.css";
import { FoodCard } from "../shared/FoodCard";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../utils/config";
import useFetch from "../hooks/useFetch";
import Spinner from "../component/Spinner";

const Menu = () => {
  const location = useLocation();
  const [filter, setFilter] = useState("");
  const [categories, setCategories] = useState([]); // State to store categories

  useEffect(() => {
    window.scrollTo(0, -1);
  }, []);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/category`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data); // Assuming the response contains an array of categories
        console.log("categories:", data.category);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };
    fetchCategories();
  }, []);

  const handleCategorySelect = (category) => {
    setFilter(category);
    setCurrentPage(1);
  };

  const {
    data: foodData,
    loading,
    error,
  } = useFetch(
    filter === "" ? `${BASE_URL}/food` : `${BASE_URL}/food/category/${filter}`
  );

  console.log("Main", foodData);
  console.log("Main", error);

  return (
    <section>
      <div className="container">
        <div className="row align-items-start">
          <div className="col-12 d-flex align-items-center  justify-content-between gap-3 pb-5 pt-3 flex-wrap">
            <div className="dropdown ">
              <button
                className="btn btn-light menu-dropdown-toggle"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                }}
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {filter === "" ? "All" : filter}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-chevron-down"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                  />
                </svg>
              </button>

              <ul
                className="dropdown-menu menu-dropdown-menu h-20"
                style={{ minWidth: "250px" }}
                aria-labelledby="dropdownMenuButton"
              >
                <li>
                  <button
                    className={`dropdown-item ${filter === "" ? "active" : ""}`}
                    onClick={() => handleCategorySelect("")}
                  >
                    <span>All</span>
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      className={`dropdown-item ${
                        filter === category.category ? "active" : ""
                      }`}
                      onClick={() => handleCategorySelect(category.category)}
                    >
                      {category.category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {loading && <Spinner />}
          {error && <h5>{error}</h5>}
          {!loading &&
            !error &&
            foodData?.map((item) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                key={item._id}
              >
                <FoodCard item={item} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;
