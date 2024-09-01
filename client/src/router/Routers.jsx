import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Menu from "../pages/Menu.jsx";
import Cart from "../pages/Cart.jsx";
// import Tours from '../pages/Tours'
// import TourDetails from '../pages/TourDetails'
// import SearchResultList from '../pages/SearchResultList'
import ThankYou from "../pages/ThankYou.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import FoodDetaill from "../pages/FoodDetaill.jsx";
import MyAccount from "../pages/MyAccount.jsx";
import MyOrders from "../pages/MyOrders.jsx";
import Feedback from "../pages/Feedback.jsx";
import ContactUS from "../pages/ContactUS.jsx";
import CookiePolicy from "../pages/CookiePolicy.jsx";
import ServiceDisclaimer from "../pages/ServiceDisclaimer.jsx";
import PrivacyPolicy from "../pages/PrivacyPolicy.jsx";
import PaymentSuccessCart from "../pages/PaymentSuccessCart.jsx";

const Routers = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/home" element={<Navigate to="/" />} />
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/fooddetail/:id" element={<FoodDetaill />} />
      <Route path="/my-orders/:id" element={<MyOrders />} />
      <Route path="/cart/:id" element={<Cart />} />
      <Route path="/about" element={<About />} />
      <Route path="/payment-success" element={<PaymentSuccessCart />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/contactus" element={<ContactUS />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />
      <Route path="/service-disclaimer" element={<ServiceDisclaimer />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      {/* User Logged In? */}
      {user ? (
        <Route path="/my-account/:id" element={<MyAccount />} />
      ) : (
        <Route path="/my-account/:id" element={<Navigate to="/login" />} />
      )}

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default Routers;
