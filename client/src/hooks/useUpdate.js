import React from "react";
import { toast } from "react-toastify";

const updateData = async (url, propertyName, propertyValue) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found in cookies");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const response = await fetch(url, {
      method: "PUT",
      headers: headers,
      credentials: "include",
      body: JSON.stringify({ [propertyName]: propertyValue }),
    });

    const result = await response.json();

    if (!response.ok) {
      toast.error(result.message || "Failed to update.");
      return;
    }

    toast.success("Successfully Updated.");
  } catch (err) {
    toast.error("Error during updating.");
    console.error(err);
  }
};

export default updateData;
