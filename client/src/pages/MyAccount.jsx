import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "../assets/images/avatar.jpg";
import "../styles/my-account.css";
import { toast } from "react-toastify";
import { BASE_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";
import { Image, Transformation } from "cloudinary-react";

const MyAccount = () => {
  useEffect(() => {
    window.scrollTo(0, -1);
  }, []);

  const [editMode, setEditMode] = useState(false);

  const handleEditModeToggle = () => {
    setEditMode(!editMode);
  };

  const navigate = useNavigate();

  const useFetch = (url) => {
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

  const { dispatch } = useContext(AuthContext);
  const { id } = useParams();
  const {
    data: userinfo,
    loading,
    error,
  } = useFetch(`${BASE_URL}/user/getUser/${id}`);

  // Update the initial state and user data object keys according to the User schema
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    telephone: "",
    postcode: "",
    address1: "",
    address2: "",
    city: "",
    password: "",
    profileImage: "",
  });

  useEffect(() => {
    setUserData({
      firstName: userinfo?.firstName,
      lastName: userinfo?.lastName,
      email: userinfo?.email,
      phone: userinfo?.phone,
      telephone: userinfo?.telephone,
      postcode: userinfo?.postcode,
      address1: userinfo?.address1,
      address2: userinfo?.address2,
      city: userinfo?.city,
      profileImage: userinfo?.profileImage,
    });
  }, [userinfo]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handlePasswordChange = (e) => {
    setPassword((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (
      password.oldPassword &&
      password.newPassword &&
      password.confirmPassword
    ) {
      try {
        const response = await fetch(`${BASE_URL}/users/${id}/password`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(password),
        });

        const { message } = await response.json();

        if (!response.ok) {
          toast.error(message);
          return;
        }
        toast.success(message);
        dispatch({ type: "LOGOUT" });
        navigate("/login");
      } catch (err) {
        console.log(err);
        toast.error("Internal Sever Error.");
      }
    } else {
      toast.error("All fields are required.");
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const { message } = await response.json();

      if (!response.ok) {
        toast.error(message);
      } else {
        dispatch({ type: "LOGOUT" });
        toast.info(message);
        navigate("/register");
      }
    } catch (err) {
      toast.error("Server not responding");
    }
  };

  const cloudinaryConfig = {
    cloudName: "dazko9ugd",
    apiKey: "229314452358913",
    apiSecret: "a60Y6vKeapSAgxHNtGpOsPhwNGY",
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      if (userData.photo) {
        const formData = new FormData();
        formData.append("file", userData.photo);

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload?upload_preset=qsimo6w7`,
          {
            method: "POST",
            body: formData,
          }
        );

        const cloudinaryData = await cloudinaryResponse.json();
        userData.photo = cloudinaryData.secure_url;
      }

      // Update the fetch URL to send the user ID in the route
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const { message } = await response.json();

      if (!response.ok) {
        toast.error(message);
        return;
      }

      setEditMode(false);
      toast.success("Profile updated successfully.");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      toast.error("Error updating profile.");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center d-flex align-items-center flex-column">
        <div className="col-7 align-items-center justify-content-center d-flex flex-column  profile text-center mt-5">
          <img
            src={userData.photo || Avatar}
            alt="Profile"
            className="profile-pic img-fluid rounded-3 border border-2"
          />
          <div className="d-flex flex-column ms-2">
            <h2 className="mt-3">
              {loading && "loading..."}
              {error && <span>{error}</span>}
              {!loading && !error && <span>{userData.firstName}</span>}
            </h2>
            <p>
              {loading && "loading......."}
              {error && <span>{error}</span>}
              {!loading && !error && <span>{userData.email}</span>}
            </p>
          </div>
        </div>
        <div className="col-md-7 col-12 mt-3">
          <div className="table-box border border-2 rounded-3 shadow p-3 mb-3">
            <form className="account-setting mt-3" onSubmit={handleSaveProfile}>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  First Name
                </span>
                <input
                  type="text"
                  id="firstName"
                  className={`form-control ${editMode ? "" : "readonly"}`}
                  placeholder="First Name"
                  value={userData.firstName}
                  aria-label="First Name"
                  aria-describedby="basic-addon1"
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Last Name
                </span>
                <input
                  type="text"
                  id="lastName"
                  className={`form-control ${editMode ? "" : "readonly"}`}
                  placeholder="Last Name"
                  value={userData.lastName}
                  aria-label="Last Name"
                  aria-describedby="basic-addon1"
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Email
                </span>
                <input
                  type="email"
                  id="email"
                  className={`form-control ${editMode ? "" : "readonly"}`}
                  placeholder="Email"
                  value={userData.email}
                  aria-label="Email"
                  aria-describedby="basic-addon1"
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Phone
                </span>
                <input
                  type="number"
                  id="phone"
                  className={`form-control ${editMode ? "" : "readonly"}`}
                  placeholder="Phone"
                  value={userData.phone}
                  aria-label="Phone"
                  aria-describedby="basic-addon1"
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Telephone
                </span>
                <input
                  type="number"
                  id="telephone"
                  className={`form-control ${editMode ? "" : "readonly"}`}
                  placeholder="Telephone"
                  value={userData.telephone}
                  aria-label="Telephone"
                  aria-describedby="basic-addon1"
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Postcode
                </span>
                <input
                  type="number"
                  id="postcode"
                  className={`form-control ${editMode ? "" : "readonly"}`}
                  placeholder="Postcode"
                  value={userData.postcode}
                  aria-label="Postcode"
                  aria-describedby="basic-addon1"
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Address1
                </span>
                <input
                  type="text"
                  id="address1"
                  className={`form-control ${editMode ? "" : "readonly"}`}
                  placeholder="Address1"
                  value={userData.address1}
                  aria-label="Address1"
                  aria-describedby="basic-addon1"
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Address2
                </span>
                <input
                  type="text"
                  id="address2"
                  className={`form-control ${editMode ? "" : "readonly"}`}
                  placeholder="Address2"
                  value={userData.address2}
                  aria-label="Address2"
                  aria-describedby="basic-addon1"
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  City
                </span>
                <input
                  type="text"
                  id="city"
                  className={`form-control ${editMode ? "" : "readonly"}`}
                  placeholder="City"
                  value={userData.city}
                  aria-label="City"
                  aria-describedby="basic-addon1"
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Profile Pic.
                </span>
                <input
                  type="file"
                  className="form-control"
                  id="profileImage"
                  accept=".png, .jpg, .jpeg"
                  disabled={!editMode}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      profileImage: e.target.files[0],
                    })
                  }
                />
              </div>
              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <button
                    type="button"
                    className="edit-profile btn btn-light"
                    onClick={handleEditModeToggle}
                    disabled={editMode}
                  >
                    <i className="ri-edit-2-line"></i> Edit Profile
                  </button>
                  <button
                    type="submit"
                    className={`edit-profile btn btn-light ${
                      editMode ? "d-block" : "d-none"
                    }`}
                    disabled={!editMode}
                    onClick={handleSaveProfile}
                  >
                    <i className="ri-edit-2-line"></i> Save Profile
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={deleteAccount}
                >
                  Delete Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
