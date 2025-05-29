import React from "react";
import { FaBox, FaTools, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Floating Background Circles */}
      <div className="floating-circles">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
{/* Navbar */}
            <nav className="navbar">
              <h2 className="navbar-title">ADMIN PANEL</h2>
              <div className="nav-links">
                <Link to="/manageasset">Manage Assets</Link>
                <Link to="/manageUsers">Manage Users</Link>
                  <Link to="/AdminReq">Manage Requests</Link>
                <Link to="/AdminIssues">Issues </Link>
                <Link to="/adminSetting">Settings</Link>
              </div>
            </nav>


      {/* Dashboard Main Content */}
      <main className="dashboard-main">
        {/* Statistics Section */}
        <div className="stats">
          <div className="card">
            <FaBox className="icon" />
            <span>Total Assets: 120</span>
          </div>
          <div className="card">
            <FaTools className="icon" />
            <span>Under Maintenance: 10</span>
          </div>
          <div className="card">
            <FaUser className="icon" />
            <span>Total Users: 50</span>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="logs">
          <h3>Recent Activity</h3>
          <table className="activity-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>User</th>
                <th>Action</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Laptop</td>
                <td>John Doe</td>
                <td><span className="assigned">Assigned</span></td>
                <td>2025-03-05</td>
              </tr>
              <tr>
                <td>Projector</td>
                <td>Jane Smith</td>
                <td><span className="returned">Returned</span></td>
                <td>2025-03-04</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
