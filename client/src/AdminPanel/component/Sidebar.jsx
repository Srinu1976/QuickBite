import React, { useState, useEffect, useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import weblogo from "../../assets/images/logo.png";
import Avatar from "../../assets/images/avatar.jpg";
import { toast } from "react-toastify";
import "./sidebar.css";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../utils/config";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const handleResize = () => {
      // Automatically collapse the sidebar on medium-sized devices (Bootstrap 5 medium breakpoint: 768px)
      setIsCollapsed(window.innerWidth <= 1000);
    };

    // Initial check on mount
    handleResize();

    // Event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);

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

  const {
    data: userinfo,
    loading,
    error,
  } = useFetch(user ? `${BASE_URL}/users/${user._id}` : null);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    toast.success("Logout Successfully!");
    navigate("/");
  };
  return (
    <>
      <div
        className={`${
          isCollapsed
            ? " d-block sidebar-collapse-behind-space "
            : " sidebar-behind-space d-block"
        }`}
      ></div>
      <div
        className={`d-flex sidebar-wrapper flex-column text-bg-dark align-items-between h-100 sidebar wrapper ${
          isCollapsed ? "collapsed-sidebar p-1" : "p-3"
        }`}
        style={{ zIndex: 10 }}
      >
        <button
          className="btn text-white collapse-btn align-item-center justify-content-center ms-1 my-auto"
          onClick={handleToggleCollapse}
          style={{ maxWidth: "70px" }}
        >
          <i className={`ri-menu-${isCollapsed ? "unfold" : "fold"}-line`}></i>
        </button>
        <div className="navigation-section">
          <Link
            to="/"
            className={`navbar-brand logo d-flex   ${
              isCollapsed ? "collapsed-sidebar" : ""
            }`}
          >
            <img
              className={`logo img-fluid rounded-2 ${
                isCollapsed ? "d-none  " : "d-block"
              }`}
              src={weblogo}
              alt=""
            />
          </Link>
          <hr />
          <ul
            className={`nav nav-pills shadow flex-column mb-auto ${
              isCollapsed ? "collapsed-sidebar" : ""
            }`}
          >
            <li className="nav-item admin-nav-items">
              <NavLink
                to="/dashboard"
                className="nav-link sidebar-link text-white"
                aria-current="page"
              >
                <i
                  className={`ri-dashboard-line ${isCollapsed ? "" : "pe-2"}`}
                ></i>
                {isCollapsed ? "" : "Dashboard"}
              </NavLink>
            </li>
            <li className="nav-item admin-nav-items">
              <NavLink to="/menu" className="nav-link sidebar-link text-white">
                <i
                  className={`ri-restaurant-line ${isCollapsed ? "" : "pe-2"}`}
                ></i>
                {isCollapsed ? "" : "Menu"}
              </NavLink>
            </li>
            <li className="nav-item admin-nav-items">
              <NavLink
                to="/orders"
                className="nav-link sidebar-link text-white"
              >
                <i
                  className={`ri-calendar-2-fill ${isCollapsed ? "" : "pe-2"}`}
                ></i>
                {isCollapsed ? "" : "Orders"}
              </NavLink>
            </li>
            <li className="nav-item admin-nav-items">
              <NavLink to="/users" className="nav-link sidebar-link text-white">
                <i className={`ri-group-line ${isCollapsed ? "" : "pe-2"}`}></i>
                {isCollapsed ? "" : "Users"}
              </NavLink>
            </li>
            <li className="nav-item admin-nav-items">
              <NavLink
                to="/messages"
                className="nav-link sidebar-link text-white"
              >
                <i className={`ri-chat-2-line ${isCollapsed ? "" : "pe-2"}`}></i>
                {isCollapsed ? "" : "Messages"}
              </NavLink>
            </li>
            <li className="nav-item admin-nav-items">
              <NavLink
                to="/feedbacks"
                className="nav-link sidebar-link text-white"
              >
                <i className={`ri-feedback-line ${isCollapsed ? "" : "pe-2"}`}></i>
                {isCollapsed ? "" : "Feedbacks"}
              </NavLink>
            </li>
            <li className="nav-item admin-nav-items">
              <NavLink
                to="/admins"
                className="nav-link sidebar-link text-white"
              >
                <i className={`ri-admin-line ${isCollapsed ? "" : "pe-2"}`}></i>
                {isCollapsed ? "" : "Admins"}
              </NavLink>
            </li>
          </ul>
        </div>
        <div
          className={`profile-section mt-auto ${
            isCollapsed ? "collapsed-sidebar" : ""
          }`}
        >
          <div className="w-100">
            <hr />
            <div className="dropdown">
              <NavLink
                to="#"
                className={`d-flex align-items-center text-white text-decoration-none ${
                  isCollapsed ? "" : "dropdown-toggle"
                } `}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={userinfo.photo || Avatar}
                  className="profileimg img-fluid rounded-circle border border-2 me-2 ms-2"
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                  }}
                  alt="profile-img"
                />
                <strong className="ms-1">
                  {isCollapsed ? "" : userinfo.username}
                </strong>
              </NavLink>
              <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                <li>
                  <NavLink
                    className="dropdown-item"
                    to={`/my-account/${user?._id}`}
                  >
                    Profile
                  </NavLink>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item" onClick={logout}>
                    Sign out
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
