import React, { useEffect, useState } from "react";
import QuickActionsNavbar from "../quickActions/QuickActionsNavbar";
import "./UserActivityLogs.css";
import api from "../../services/api"; // or your axios instance

const UserActivityLogs = () => {
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserLogs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id;
        if (!userId) return;

        // Prefer a user-specific endpoint
        const response = await api.get(`/logs/user/${userId}`);
        setActivityData(response.data);
      } catch (err) {
        setError("Failed to fetch logs");
      } finally {
        setLoading(false);
      }
    };
    fetchUserLogs();
  }, []);

  const getActionClass = (action) => {
    if (!action || typeof action !== "string") return "";
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
                <td>
                  {log.timestamp
                    ? new Date(log.timestamp).toLocaleString()
                    : "N/A"}
                </td>
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