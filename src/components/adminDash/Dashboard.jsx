import React, { useEffect, useState } from "react";
import { FaBox, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [assetCount, setAssetCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [logs, setLogs] = useState([]);

  // Fetch assets and users count
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch assets
        const assetsRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/assets`);
        const assets = await assetsRes.json();
        setAssetCount(Array.isArray(assets) ? assets.length : 0);

        // Fetch users
        const token = localStorage.getItem("token");
        const usersRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const users = await usersRes.json();
        setUserCount(Array.isArray(users) ? users.length : 0);
      } catch (err) {
        setAssetCount(0);
        setUserCount(0);
      }
    };

    fetchCounts();
  }, []); // If you want to auto-refresh, add dependencies or polling

  // Fetch recent activity logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const logsRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/logs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const logsData = await logsRes.json();
        setLogs(Array.isArray(logsData) ? logsData.slice(0, 10) : []);
      } catch (err) {
        setLogs([]);
      }
    };

    fetchLogs();
  }, []);

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
          <Link to="/AdminIssues">Issues</Link>
          <Link to="/adminSetting">Settings</Link>
        </div>
      </nav>

      {/* Dashboard Main Content */}
      <main className="dashboard-main">
        {/* Statistics Section */}
        <div className="stats">
          <div className="card">
            <FaBox className="icon" />
            <span>Total Assets: {assetCount}</span>
          </div>
          <div className="card">
            <FaUser className="icon" />
            <span>Total Users: {userCount}</span>
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
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="4">No recent activity</td>
                </tr>
              ) : (
                logs.map((log, idx) => (
                  <tr key={log._id || idx}>
                    <td>
                      {log.assetId && log.assetId.name
                        ? log.assetId.name
                        : "N/A"}
                    </td>
                    <td>
                      {log.userId && log.userId.name
                        ? log.userId.name
                        : "N/A"}
                    </td>
                    <td>
                      <span>
                        {log.action}
                      </span>
                    </td>
                    <td>
                      {log.date
                        ? new Date(log.date).toLocaleDateString()
                        : (log.timestamp
                          ? new Date(log.timestamp).toLocaleDateString()
                          : "N/A")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
