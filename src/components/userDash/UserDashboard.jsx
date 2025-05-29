import React from "react";
import QuickActionsNavbar from "../quickActions/QuickActionsNavbar"; // ✅ Import Navbar
import { FaLaptop, FaTools, FaExclamationTriangle } from "react-icons/fa";
import "./UserDashboard.css";

const UserDashboard = () => {
  return (
    <div className="user-dashboard">
      {/* ✅ Navbar Fixed at the Top */}
      <QuickActionsNavbar />

      <h1 className="dashboard-title">User Dashboard</h1>

      <div className="dashboard-cards">
        <div className="card">
          <FaLaptop className="card-icon" />
          <h2>Total Assets</h2>
          <p>15</p>
        </div>
        <div className="card">
          <FaTools className="card-icon" />
          <h2>Assigned</h2>
          <p>10</p>
        </div>
        <div className="card">
          <FaExclamationTriangle className="card-icon" />
          <h2>Pending Requests</h2>
          <p>2</p>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <ul>
          <li>Laptop assigned on March 25</li>
          <li>Mouse replaced on March 22</li>
          <li>Keyboard request pending approval</li>
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;
