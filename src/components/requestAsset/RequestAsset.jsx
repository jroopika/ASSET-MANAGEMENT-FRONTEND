import axios from "axios";
import React, { useState, useEffect } from "react";
import QuickActionsNavbar from "../quickActions/QuickActionsNavbar";
import "./RequestAsset.css";

const RequestAsset = () => {
  const [assetType, setAssetType] = useState("");
  const [reason, setReason] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData._id) {
      setUserId(userData._id);
    } else {
      setErrorMessage("User not found. Please log in again.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!assetType || !reason) {
      setErrorMessage("Please fill in all the fields.");
      return;
    }

    if (!userId) {
      setErrorMessage("User ID is missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.post("https://asset-management-backend-qezn.onrender.com/api/requests/request", {
        userId,
        assetType,
        reason,
      });

      alert(response.data.message);
      setAssetType("");
      setReason("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Failed to submit request. Please try again.");
    }
  };

  return (
    <>
      <QuickActionsNavbar />
      <div className="page-container">
        <h1>Request New Asset</h1>
        <form onSubmit={handleSubmit} className="asset-form">
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <label>Asset Type:</label>
          <input
            type="text"
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            required
          />

          <label>Reason for Request:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          ></textarea>

          <button type="submit">Submit Request</button>
        </form>
      </div>
    </>
  );
};

export default RequestAsset;
