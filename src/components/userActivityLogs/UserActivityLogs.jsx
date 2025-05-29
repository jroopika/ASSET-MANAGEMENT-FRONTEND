import React, { useEffect, useState } from "react";
import { fetchLogs } from "../../services/api";
import QuickActionsNavbar from "../quickActions/QuickActionsNavbar";
import "./UserActivityLogs.css";

const UserActivityLogs = () => {
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchLogs()
        .then((data) => {
          setActivityData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || "Failed to fetch activity logs.");
          setLoading(false);
        });
    } else {
      setError("No token found. Please log in.");
      setLoading(false);
    }
  }, []);

  // Function to get class name based on action type
  const getActionClass = (action) => {
    switch (action.toLowerCase()) {
      case "requested asset":
        return "action-request";
      case "assigned asset":
      case "assigned asset to user":
        return "action-assigned";
      case "returned asset":
        return "action-returned";
      case "reported issue":
        return "action-issue";
      case "resolved issue":
        return "action-resolved";
      case "approved asset request":
        return "action-approved";
      case "rejected asset request":
        return "action-rejected";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <QuickActionsNavbar />
        <h1>User Activity Logs</h1>
        <p className="loading-message">Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <QuickActionsNavbar />
      <h1>User Activity Logs</h1>
      {error && <p className="error-message">{error}</p>}
      <table className="activity-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Action</th>
            <th>Details</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {activityData.length > 0 ? (
            activityData.map((log, index) => (
              <tr key={log._id}>
                <td>{index + 1}</td>
                <td className={getActionClass(log.action)}>{log.action}</td>
                <td>{log.details}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No logs available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserActivityLogs;