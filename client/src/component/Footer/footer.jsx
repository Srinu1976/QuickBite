import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./footer.css";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/images/logo.png";
import Appstore from "../../assets/images/appstore.png";
import Playstore from "../../assets/images/gplay.png";
import { toast } from "react-toastify";

const Footer = () => {
  const year = new Date().getFullYear();
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubscribe = () => {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Newsletter Subscribed Successfully");
    setEmail("");
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const validateEmail = (email) => {
    // Regular expression for email validation
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <>
      <div
        className="container newsletter rounded-3  align-items-center d-flex mt-5"
        style={{ marginTop: "-50px", position: "relative", zIndex: "1" }}
      >
        <div className="row d-flex align-items-center justify-content-between mx-md-auto mx-0">
          <div className="col-md-4 col-12 d-flex align-items-center news-letter-text ">
            <h5 className="">
              Subscribe <br className="d-md-block d-none" /> To Our Newsletter
            </h5>
          </div>
          <div className="col-lg-5 col-md-8 col-12 pb-2 pb-lg-0 ">
            <div className="newsletter-input my-auto ">
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={handleChange}
              />
              <button className="btn newsletter-btn" onClick={handleSubscribe}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer className="container-fluid text-center text-lg-start text-muted footer-section">
        <section className="pb-1 ">
          <div className="container text-center text-md-start ">
            <div className="row ">
              <footer className="text-center text-lg-start text-muted">
                <section className="footer-columns">
                  <div className="container-fluid text-center text-md-start">
                    <div className="d-flex flex-column flex-md-row">
                      <div className="col-md-4 col-lg-3 foot-texts footer-logo mx-auto mb-4 mt-2">
                        <img className="img-fluid " src={logo} alt="" />
                        <p style={{ fontSize: "15px" }}>
                          TASTE THE FINEST FOOD IN SUNDERLAND.
                        </p>
                      </div>
                      <div style={{ color: "white" }}>
                        <h2 style={{ fontSize: "18px" }}>Contact Info</h2>
                        <p style={{ fontSize: "16px" }}>
                          51 St. Lukes Terrace, Sunderland SR4 6NF
                        </p>
                        <h2 style={{ fontSize: "18px" }}>
                          Telephone Orders Welcome
                        </h2>
                        <a
                          href="tel:01915100176"
                          style={{ color: "#90E051", fontSize: "15px" }}
                        >
                          01915100176
                        </a>
                        <div
                          style={{
                            display: "flex",
                            marginTop: "20px",
                            gap: "10px",
                          }}
                        >
                          <a
                            target="_blank"
                            href="https://apps.apple.com/gb/app/pizza-uno-sunderland/id6450704975
                          "
                          >
                            <img src={Appstore} alt="Logo" />
                          </a>
                          <a
                            target="_blank"
                            href="https://play.google.com/store/apps/details?id=uk.co.etakeawaymax.pizzaunosunderland&pli=1"
                          >
                            <img src={Playstore} alt="Logo" />
                          </a>
                        </div>
                      </div>
                      <div className="col-md-4 col-lg-3 mx-auto mb-4 foot-texts footer-quick-links">
                        {/* <h6 className="text-uppercase footer-heading footer-link-title fw-bold mb-4">Explore</h6> */}
                        <div className="mt-4 mt-sm-0">
                          <div className="col-md-12 explore-text">
                            <p className="w-100">
                              <Link to="/" className="text-reset">
                                <i className="ri-arrow-right-s-line"></i> Home
                              </Link>
                            </p>
                            <p>
                              <Link to="/privacy-policy" className="text-reset">
                                <i className="ri-arrow-right-s-line"></i>{" "}
                                Privacy Policy
                              </Link>
                            </p>
                          </div>
                          <div className="col-md-12 explore-text">
                            <p>
                              <a
                                href={`/my-orders/${user?._id}`}
                                className="text-reset"
                              >
                                <i className="ri-arrow-right-s-line"></i> My
                                Order
                              </a>
                            </p>
                            <p>
                              <Link to="/cookie-policy" className="text-reset">
                                <i className="ri-arrow-right-s-line"></i> Cookie
                                Policy{" "}
                              </Link>
                            </p>
                            <p>
                              <Link
                                to="/service-disclaimer"
                                className="text-reset"
                              >
                                <i className="ri-arrow-right-s-line"></i>{" "}
                                Service Disclaimer
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <div className="col-12 d-flex justify-content-center">
                  <p className="copyright foot-texts">
                    {" "}
                    Pizza Uno Sunderland © {year}. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </section>
      </footer>
    </>
  );
};

export default Footer;
