import React, { useState, useEffect, useContext } from "react";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "./../utils/config";
import { toast } from "react-toastify";

import LoginImg from "../assets/images/login.png";
import userIcon from "../assets/images/user.png";

const Login = () => {
  useEffect(() => {
    window.scrollTo(0, -1);
  }, []);

  const [credentials, setCredentials] = useState({
    email: undefined,
    password: undefined,
  });

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await fetch(`${BASE_URL}/user/login`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const result = await res.json();

      console.log(result);
      if (!result.token) {
        return toast.error(result.message);
      }
      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.data.role);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: {
            ...result.data,
            role: result.data.role,
          },
        },
      });
      toast.success(result.message);
      navigate("/dashboard");
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message });
      toast.error("An error occurred during login");
    }
  };

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-lg-8 m-auto col-12">
            <div className="login-container d-flex justify-content-between">
              <div className="login-form ">
                <div className="user" style={{ top: "-60px" }}>
                  <img
                    className="rounded-circle img-fluid"
                    src={userIcon}
                    alt=""
                  />
                </div>
                <h2>Login</h2>

                <form onSubmit={handleClick}>
                  <div className="form-group mb-3">
                    <input
                      type="email"
                      placeholder="Email"
                      id="email"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <input
                      type="password"
                      placeholder="Password"
                      id="password"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button className="btn btn-secondary auth-btn" type="submit">
                    Login
                  </button>
                </form>
                <p>
                  Don't have an account? <Link to="/register">Create</Link>
                </p>
              </div>
              <div className="login-img d-flex  justify-content-center">
                <img src={LoginImg} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
