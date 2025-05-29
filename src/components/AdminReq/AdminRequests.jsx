import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminRequests.css";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all requests from the backend
  const fetchRequests = async () => {
    try {
      const response = await axios.get("https://asset-management-backend-qezn.onrender.com/api/requests/all");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle approve/reject actions for the admin
  const handleAction = async (id, action) => {
    try {
      const request = requests.find((req) => req._id === id);

      if (request.status !== "approved" && action !== "approved") {
        alert("This request must be approved by HOD before the admin can approve or reject it.");
        return;
      }

      const approvedBy = localStorage.getItem("userId");
      const updatedRequest = { ...request, status: action, approvedBy };

      await axios.put(`https://asset-management-backend-qezn.onrender.com/api/requests/request/${id}`, updatedRequest);

      setRequests((prevRequests) =>
        prevRequests.map((req) => (req._id === id ? { ...req, status: action } : req))
      );

      alert(`Request ${action} successfully`);
    } catch (error) {
      console.error("Error performing action:", error);
      alert("Failed to perform action. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading requests...</p>;
  }

  return (
    <div className="admin-requests-container">
      <nav className="navbar">
        <h2 className="navbar-title">ADMIN PANEL</h2>
        <div className="nav-links">
          <Link to="/manageasset">Manage Assets</Link>
          <Link to="/manageUsers">Manage Users</Link>
          <Link to="/AdminReq">Manage Requests</Link>
          <Link to="/AdminIssues">Issues</Link>
          <Link to="/adminSetting">Settings</Link>
        </div>
      </nav>

      <h1>Asset Requests</h1>

      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <table className="requests-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Asset Type</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.userId?.name || "Unknown User"}</td>
                <td>{req.assetType}</td>
                <td>{req.reason}</td>
                <td>{req.status}</td>
                <td>
                  {req.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleAction(req._id, "approved")}
                        disabled={req.status !== "approved"}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(req._id, "rejected")}
                        disabled={req.status !== "approved"}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>Action Taken</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminRequests;
