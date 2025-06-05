import React, { useState, useEffect } from "react";
import axios from "axios";
import QuickActionsNavbar from "../quickActions/QuickActionsNavbar";
import "./ReportIssue.css";

const ReportIssue = () => {
  const [assetName, setAssetName] = useState("");  // Use assetName as text input
  const [assetId, setAssetId] = useState("");      // Store the assetId once matched
  const [issue, setIssue] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser._id); // Assuming userId is part of the user object
    } else {
      alert("User not found. Please log in again.");
    }
  }, []);

  // Check if the asset exists when the user finishes typing the asset name
  const checkAssetExists = async () => {
    try {
      const response = await axios.get(`https://asset-management-backend-crnj.onrender.com/api/assets/checkByName?assetName=${assetName}`);
      if (response.data) {
        console.log("Asset found:", response.data); // Handle found asset
        setAssetId(response.data._id); // Set the assetId
      }
    } catch (error) {
      console.error("Asset not found:", error.response?.data?.message);
      setAssetId("");  // Clear the assetId if asset not found
      alert("Asset not found, please check the name and try again.");
    }
  };

  // Submit the report to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!assetName.trim() || !issue.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    if (!assetId) {
      alert("The asset does not exist. Please enter a valid asset name.");
      return;
    }

    try {
      await axios.post("https://asset-management-backend-crnj.onrender.com/api/issues", {
        assetId,
        userId,
        issue,
      });

      alert("Issue reported successfully!");
      setAssetName("");
      setIssue("");
      setAssetId("");  // Clear assetId after report submission
    } catch (error) {
      console.error("Error reporting issue:", error);
      alert("Failed to report issue. Please try again.");
    }
  };

  return (
    <>
      <QuickActionsNavbar />
      <div className="page-container">
        <h1>Report an Issue</h1>
        <form onSubmit={handleSubmit} className="issue-form">
          <label>Asset Name:</label>
          <input
            type="text"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            onBlur={checkAssetExists}  // Check asset when the input loses focus
            required
          />

          <label>Describe the Issue:</label>
          <textarea
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            required
          ></textarea>

          <button type="submit">Submit Report</button>
        </form>
      </div>
    </>
  );
};

export default ReportIssue;
