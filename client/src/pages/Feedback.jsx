import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../utils/config";

const Feedback = () => {
  useEffect(() => {
    window.scrollTo(0, -1);
  }, []);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
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
    const messageError = validateMessage(formData.feedback);

    if (nameError || emailError || messageError) {
      // Display validation errors using toast
      toast.error(nameError || emailError || messageError);
    } else {
      const response = await fetch(`${BASE_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Handle non-successful responses
        toast.error("Failed to submit feedback");
      }

      setFormData({
        name: "",
        email: "",
        feedback: "",
      });

      // Display success message using toast
      toast.success("Feedback submitted successfully");
    }
  };

  return (
    <div className="container-feedback">
      <h2 className="feedback-heading">Feedback Form</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message" className="form-label">
            Feedback:
          </label>
          <textarea
            id="feedback"
            name="feedback"
            value={formData.feedback}
            onChange={handleInputChange}
            className="form-textarea"
            rows="4"
            required
          />
        </div>
        <button
          type="submit"
          className="submit-button"
          style={{ border: "none" }}
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default Feedback;
