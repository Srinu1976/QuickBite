import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../utils/config";

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo(0, -1);
  }, []);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const validateName = (value) => {
    if (!value.trim()) {
      return "Name is required";
    }
    return "";
  };

  const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) {
      return "Email is required";
    } else if (!emailPattern.test(value)) {
      return "Invalid email format";
    }
    return "";
  };

  const validateMessage = (value) => {
    if (!value.trim()) {
      return "Message is required";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const messageError = validateMessage(formData.message);

    if (nameError || emailError || messageError) {
      // Display validation errors using toast
      toast.error(nameError || emailError || messageError);
    } else {
      const response = await fetch(`${BASE_URL}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Handle non-successful responses
        throw new Error("Failed to submit Message");
      }

      setFormData({
        name: "",
        email: "",
        message: "",
      });

      // Display success message using toast
      toast.success("Message submitted successfully");
    }
  };

  return (
    <div style={{ margin: "50px 0" }}>
      <div className="container-contactus">
        <div className="grid-contactus">
          <div>
            <div className="form-container">
              <h2 className="section-title">Contact Us</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message" className="label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="textarea"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="submit-btn"
                  style={{ border: "none", backgroundColor: "#90E051" }}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
          <div className="contact-info-container">
            <div className="contact-info">
              <h2 className="section-title">Contact Information</h2>
              <p className="info">
                <span className="info-label">Address:</span> Pizza Uno
                Sunderland 51 St. Lukes Terrace, Sunderland SR4 6NF
              </p>
              <p className="info">
                <span className="info-label">Telephone:</span> 01915100176
              </p>
            </div>
            <div className="follow-us">
              <h2 className="section-title">Follow Us</h2>
              <div className="social-icons">
                <a href="#" className="social-icon">
                  {" "}
                  Facebook
                </a>
                <a href="#" className="social-icon">
                  {" "}
                  Instagram
                </a>
                <a href="#" className="social-icon">
                  {" "}
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
