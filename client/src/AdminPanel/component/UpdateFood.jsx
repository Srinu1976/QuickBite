import React, { useEffect, useState } from "react";
import "./create-food.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../utils/config";
import useFetch from "../../hooks/useFetch";
import Spinner from "../../component/Spinner";

const UpdateFood = () => {
  const { id } = useParams();
  const {
    data: food,
    loading,
    error,
  } = useFetch(`${BASE_URL}/food/foods/${id}`);
  console.log("food:", food);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the food data has been fetched
    if (food) {
      setFoodData({
        name: food.name || "",
        category: food.category || "",
        price: food.price || 0,
        image: food.image || "",
        description: food.description || 0,
      });
    }
  }, [food]);

  const [foodData, setFoodData] = useState({
    name: food.name || "",
    category: food.category || "",
    price: food.price || 0,
    image: food.image || "",
    description: food.description || 0,
  });

  const handleChange = (e) => {
    setFoodData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const cloudinaryConfig = {
    cloudName: "dazko9ugd",
    apiKey: "229314452358913",
    apiSecret: "a60Y6vKeapSAgxHNtGpOsPhwNGY",
  };

  const handleUpdateFood = async (e) => {
    e.preventDefault();
    if (
      !foodData.name ||
      !foodData.category ||
      !foodData.price ||
      !foodData.description ||
      !foodData.image
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      if (foodData.image) {
        const formData = new FormData();
        formData.append("file", foodData.image);

        const response = await fetch(`${BASE_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const imageData = await response.json();
        foodData.image = imageData.file.filename; // Assuming backend returns the filename
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in cookies");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(`${BASE_URL}/food/${id}`, {
        method: "PUT",
        headers: headers,
        credentials: "include",
        body: JSON.stringify(foodData),
      });

      const { message } = await response.json();

      if (!response.ok) {
        toast.error(message);
        return;
      }

      toast.success("Successfully Updated The Food.");
      navigate("/menu");
    } catch (err) {
      toast.error("Error updating Food.");
      console.error(err);
    }
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      <div className="d-flex w-100 align-items-center justify-content-center vh-100">
        <div className="container">
          <div className="row">
            <div className="col-12 shadow-lg rounded-2">
              <form>
                <h1 className="text-center mb-5 mt-3">Update The Food</h1>
                <div className="input-fields input-group mb-3 d-flex flex-column flex-sm-row gap-3 gap-md-0">
                  <div className="d-flex  flex-grow-1">
                    <span className="input-group-text">Food name:</span>
                    <input
                      type="text"
                      name="name"
                      value={foodData.name}
                      className="form-control"
                      placeholder="name of the food"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="d-flex flex-grow-1 ">
                    <span className="input-group-text">Category:</span>
                    <input
                      type="text"
                      name="category"
                      value={foodData.category}
                      className="form-control"
                      placeholder="Category of the food"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="input-fields input-group mb-3">
                  <span className="input-group-text">Price:</span>
                  <input
                    type="number"
                    name="price"
                    value={foodData.price}
                    className="form-control"
                    placeholder="Price of the food"
                    onChange={handleChange}
                  />
                </div>
                <div className="input-fields input-group mb-3">
                  <span className="input-group-text">description:</span>
                  <textarea
                    rows="5"
                    name="description"
                    value={foodData.description}
                    className="form-control"
                    placeholder="descriptionription of the food"
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group mb-3">
                  <label
                    className="input-group-text"
                    htmlFor="inputGroupFile01"
                  >
                    Food Pic
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="image"
                    id="inputGroupFile01 image"
                    accept=".png, .jpg, .jpeg"
                    onChange={(e) =>
                      setFoodData({ ...foodData, image: e.target.files[0] })
                    }
                  />
                </div>
                <div className="justify-content-end d-flex">
                  <button
                    type="submit"
                    onClick={handleUpdateFood}
                    className="btn btn-light create-tour-btn mb-3"
                  >
                    {" "}
                    <i className="ri-file-add-line"></i> Update Food
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateFood;
