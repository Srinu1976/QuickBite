import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/food-detail.css";
import calculateAvgRating from "../utils/avgRating";
import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";
import Avatar from "../assets/images/avatar.jpg";
import { toast } from "react-toastify";
import Spinner from "../component/Spinner";

const FoodDetaill = () => {
  const { user } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(1);
  const Navigate = useNavigate();
  const { id } = useParams();
  const {
    data: food,
    loading,
    error,
  } = useFetch(`${BASE_URL}/food/foods/${id}`);
  const reviewMsgRef = useRef("");
  const [foodRating, setFoodRating] = useState(null);

  useEffect(() => {
    window.scrollTo(0, -1);
  }, []);

  const { totalRating, avgRating } = calculateAvgRating(food?.reviews);
  const deleveryCharges = 1.99;
  const TotalAmount = (quantity * food?.price + deleveryCharges).toFixed(2);
  const options = { day: "numeric", month: "long", year: "numeric" };

  const useFetch2 = (url) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
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

      fetchData();
    }, [url]);

    return { data, loading, error };
  };

  const {
    data: userinfo,
    loading: userLoading,
    error: userError,
  } = useFetch2(user ? `${BASE_URL}/user/getUser/${user._id}` : null);

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleManualQuantityChange = (e) => {
    const enteredValue = parseInt(e.target.value, 10);
    if (!isNaN(enteredValue) && enteredValue > 0) {
      setQuantity(enteredValue);
    } else {
      // If the entered value is not a positive number, reset to 1
      setQuantity(1);
    }
  };

  if (!food) {
    return <div>Item not found</div>;
  }
  const { image, name, description, price, reviews, category } = food;

  const submitHandler = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;

    try {
      if (!userinfo || userinfo === undefined || userinfo === null) {
        toast.error("Please Sign-In");
      }
      const reviewObj = {
        username: userinfo?.username,
        reviewText,
        rating: foodRating,
      };

      const res = await fetch(`${BASE_URL}/review/${id}`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(reviewObj),
      });

      const result = await res.json();
      if (!res.ok) {
        return toast.error(result.message);
      }

      toast.success(result.message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddToCart = async (foodId) => {
    try {
      if (!user) {
        return toast.error("Please Sign-In");
      } else {
        const cartItem = {
          userId: user._id,
          foodId: foodId,
          foodName: name,
          quantity: 1,
          price: price,
          photo: image,
          category: category,
        };
        console.log(cartItem);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found in cookies");
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await fetch(`${BASE_URL}/cart/addtocart`, {
          method: "post",
          headers: headers,
          credentials: "include",
          body: JSON.stringify(cartItem),
        });
        console.log("run");
        const result = await response.json();

        if (!response.ok) {
          return toast.error(
            result.message || "Failed to add item to the cart"
          );
        }

        toast.success("Item added in cart");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while processing your request");
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    await handleAddToCart(id);
    Navigate(`${BASE_URL}/cart/${user._id}`);
  };

  return (
    <section>
      <div className="container">
        {loading && <Spinner />}
        {error && <h4 className="text-center pt-5">{error}</h4>}
        {!loading && !error && (
          <div
            className="row align-items-center justify-content-center"
            key={id}
          >
            <div className="col-md-7 col-12 mb-3 mb-md-0">
              <img
                className="food-item-img  img-fluid rounded-2"
                src={`/uploads/${image}`}
                alt="FoodImg"
              />
            </div>
            <div className="food-info col-md-5 col-12 position-sticky">
              <h1>{name}</h1>
              <span className="food-rating d-flex gap-1 mb-1">
                Rating:
                <i className="ri-star-fill"></i>
                <span className="num">{avgRating == 0 ? null : avgRating}</span>
                {totalRating == 0 ? (
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Not Rated
                  </span>
                ) : (
                  <span>({reviews?.length})</span>
                )}
              </span>
              <p className="mb-2 ">Category: {category}</p>
              <p>{description}</p>
              <div className="quantity d-flex align-items-center justify-content-between mb-3">
                <h6>Quantity: </h6>
                <div className="input-group w-auto justify-content-end align-items-center">
                  <input
                    type="button"
                    value="-"
                    className="button-minus border rounded-circle  icon-shape icon-sm mx-1 lh-0"
                    data-field="quantity"
                    onClick={() => handleQuantityChange("decrease")}
                  />
                  <input
                    type="number"
                    step="1"
                    value={quantity}
                    name="quantity"
                    onBlur={handleManualQuantityChange}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="quantity-field border-0 text-center w-25"
                  />
                  <input
                    type="button"
                    value="+"
                    className="button-plus border rounded-circle icon-shape icon-sm lh-0 ms-1"
                    data-field="quantity"
                    onClick={() => handleQuantityChange("increase")}
                  />
                </div>
              </div>
              <div>
                <p className="d-flex justify-content-between align-items-center">
                  Price:{" "}
                  <span>
                    {quantity} <i className="ri-close-line"></i> £{price}
                  </span>
                </p>
                <p className="d-flex justify-content-between align-items-center">
                  Delivery Charges: <span>£{deleveryCharges}</span>
                </p>
                <h5 className="d-flex justify-content-between align-items-center">
                  Total Amount: <span>£{TotalAmount}</span>
                </h5>
              </div>
              <div className="d-flex justify-content-between mt-4 gap-3">
                <button
                  className="btn btn-warning"
                  onClick={() => handleAddToCart(id)}
                >
                  <i className="ri-shopping-cart-line"></i> Add to Cart
                </button>
                <Link className="btn order-btn btn-light" onClick={handleOrder}>
                  Order
                </Link>
              </div>
            </div>
          </div>
        )}
        {/* ============== Tour-Reviews-Section-Start ============== */}

        <div className="tour-reviews mt-5 col-lg-7 col-12 order-5">
          <h5>Reviews ({reviews?.length} reviews)</h5>
          <form onSubmit={submitHandler}>
            <div className="food-rating rating-group d-flex align-items-center gap-3 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() =>
                    setFoodRating((prevRating) =>
                      prevRating === star ? null : star
                    )
                  }
                  className={foodRating && star <= foodRating ? "active" : ""}
                >
                  <i
                    className={
                      foodRating && star <= foodRating
                        ? "ri-star-fill"
                        : "ri-star-line"
                    }
                  ></i>
                </span>
              ))}
            </div>
            <div className="review-input">
              <input
                type="text"
                ref={reviewMsgRef}
                placeholder="Share your thoughts"
                required
              />
              <button
                className="review-btn btn btn-primary rounded-5"
                type="submit"
              >
                {" "}
                Submit{" "}
              </button>
            </div>
          </form>

          <div className="form-group-reviews">
            {reviews?.map((review, index) => (
              <div className="review-item mt-4 d-flex " key={index}>
                <img
                  className="review-img img-fluid me-1 rounded-circle"
                  src={Avatar}
                  alt=""
                />
                <div className="w-100">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="align-items-center justify-content-center">
                      <h5 className="mb-0">{review.username}</h5>
                      <p className="review-date mb-1 pt-0">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          options
                        )}
                      </p>
                    </div>
                    <span className="food-rating d-flex align-items-center">
                      {review.rating}
                      <i className="ri-star-s-fill"></i>
                    </span>
                  </div>
                  <h6>{review.reviewText}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============== Tour-Reviews-Section-End ============== */}
      </div>
    </section>
  );
};

export default FoodDetaill;
