import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import "./QuickActionsNavbar.css";

const QuickActionsNavbar = () => {
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) {
      // Redirect to login if not authenticated
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Logout function to clear localStorage and redirect to login
  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    // Clear browser history to prevent back navigation
    window.history.pushState(null, "", window.location.href);
    window.history.pushState(null, "", window.location.href);
    window.history.pushState(null, "", "/login");

    // Redirect to login
    navigate("/login", { replace: true });
    console.log("Local storage cleared and redirected to login");
  };

  return (
    <nav className="quick-actions-navbar">
      {/* User Dashboard on the left */}
      <Link to="/userDashboard" className="nav-title">
        User Dashboard
      </Link>

      {/* Navigation Links at the Center */}
      <div className="nav-links">
        <Link to="/requestAsset">Request New Asset</Link>
        <Link to="/scanQR">Scan QR Code</Link>
        <Link to="/reportIssue">Report Issue</Link>
        <Link to="/userActivityLogs">Activity Logs</Link>
      </div>

      {/* Profile & Logout on Right */}
      <div className="nav-right">
        <Link to="/profile" className="nav-btn">
          <FaUser /> Profile
        </Link>
        <button onClick={handleLogout} className="nav-btn logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
};

export default QuickActionsNavbar;