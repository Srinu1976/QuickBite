import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import SpecialOnes from "../component/SpecialOnes/SpecialOnes";
import Information from "../component/WorkingHours.jsx";
import CompanyStats from "../shared/CompanyStats";
import Faq from "./Faq";
import category from "../assets/Data/category.js";

import heroImg from "../assets/images/hero-img.png";
import heroObj from "../assets/images/hero-obj.png";
import WorkingHours from "../component/Information.jsx";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, -1);
  }, []);

  return (
    <>
      {/* ====================================== Hero Section Start ====================================== */}
      <section className="hero-section pb-0 pt-0 mb-0 h-100vh">
        <div className="container">
          <div className="row justify-content-center">
            <div className="hero-text col-lg-5 col-md-6 col-12 pt-0 pt-lg-5 mt-2">
              <h1>
                Tasty Food
                <br />
                <span>Collections</span>
              </h1>
              <p>“TASTE THE FINEST FOOD IN SUNDERLAND”</p>
              <Link to="/menu" className="menu-btn btn btn-primary">
                Menu
              </Link>
            </div>
            <div className="hero-img-box col-lg-7 col-md-6 col-9 d-flex justify-content-end align-items-center position-relative">
              <img
                className="hero-obj img-fluid position-absolute  ps-5 ps-lg-0 d-none d-md-block"
                src={heroObj}
                alt="Hero-obj"
              />
              <img
                className="hero-img img-fluid position-relative pt-3 pt-md-0  position-md-absolute me-lg-5 me-3 mb-3 "
                src={heroImg}
                alt="Hero-Img"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Information */}
      <div
        className="infoHours"
        style={{
          display: "flex",
          padding: "8% 10%",
          width: "100%",
          maxWidth: "1300px ",
          margin: "50px auto",
          gap: "20px",
        }}
      >
        <div style={{ width: "100%" }}>
          <WorkingHours />
        </div>
        <div style={{ width: "100%" }}>
          <Information />
        </div>
      </div>
      {/* ====================================== Hero Section End ====================================== */}

      {/* ====================================== Company Stats Section Start ====================================== */}
      <CompanyStats />
      {/* ====================================== Company Stats Section End ====================================== */}

      {/* ====================================== Special Ones Section Start ====================================== */}
      {/* <section>
        <div className="container">
          <div className="row">
            <div className="col-12 mb-5 mt-5">
              <h1 className="text-center">SPECIAL ONES</h1>
              <div className="heading-line"></div>
            </div>
            <SpecialOnes />
          </div>
        </div>
      </section> */}
      {/* ====================================== Special Ones Section End ====================================== */}

      {/* ====================================== Categories Section Start ====================================== */}
      <section>
        <div className="container">
          <div className="row align-items-center justify-content-center g-4">
            <div className="col-12">
              <h1 className="text-center">CATEGORIES</h1>
              <div className="heading-line mb-3"></div>
            </div>
            {category.map((category) => (
              <div
                className="category-box col-md-4 col-sm-6 col-12 d-flex align-items-center justify-content-center"
                key={category.id}
              >
                <Link
                  to={{
                    pathname: "/menu",
                    search: `?category=${category.name}`,
                  }}
                  className="category rounded-5 overflow-hidden text-center d-flex align-items-center justify-content-center"
                >
                  <h3 className="category-text position-absolute">
                    {category.name}
                  </h3>
                  <img
                    className="img-fluid rounded-5"
                    src={category.photo}
                    alt="CategoryImg"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ====================================== Categories Section End ====================================== */}

      {/* ====================================== FAQ Section Start ====================================== */}
      <section className="faq-section">
        <Faq />
      </section>
      {/* ====================================== FAQ Section End ====================================== */}
    </>
  );
};

export default Home;
