import React, { useEffect, useState } from "react";
import QuickActionsNavbar from "../quickActions/QuickActionsNavbar";
import { FaLaptop, FaTools, FaExclamationTriangle, FaHistory } from "react-icons/fa";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [stats, setStats] = useState({
    totalAssets: 0,
    assigned: 0,
    pendingRequests: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Fetch user stats and activity
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        // Fetch user's assets and requests
        const response = await fetch(`${process.env.REACT_APP_API_URL || "https://asset-management-backend-crnj.onrender.com"}/api/assets/user/${user._id}`);
        const data = await response.json();
        
        setStats({
          totalAssets: data.totalAssets || 0,
          assigned: data.assigned || 0,
          pendingRequests: data.pendingRequests || 0
        });

        // Fetch recent activity
        const activityResponse = await fetch(`${process.env.REACT_APP_API_URL || "https://asset-management-backend-crnj.onrender.com"}/api/logs/user/${user._id}`);
        const activityData = await activityResponse.json();
        setRecentActivity(activityData.slice(0, 5) || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="user-dashboard">
      <QuickActionsNavbar />
      
      <div className="dashboard-container">
        <h1 className="dashboard-title">Welcome to Your Dashboard</h1>
        
        <div className="dashboard-cards">
          <div className="stat-card">
            <div className="card-icon">
              <FaLaptop />
            </div>
            <div className="card-content">
              <h3>Total Assets</h3>
              <p>{stats.totalAssets}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="card-icon">
              <FaTools />
            </div>
            <div className="card-content">
              <h3>Assigned</h3>
              <p>{stats.assigned}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="card-icon">
              <FaExclamationTriangle />
            </div>
            <div className="card-content">
              <h3>Pending Requests</h3>
              <p>{stats.pendingRequests}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="recent-activity">
            <div className="section-header">
              <FaHistory className="section-icon" />
              <h2>Recent Activity</h2>
            </div>
            <div className="activity-list">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <span className="activity-icon">
                      {activity.action === "requested" ? <FaExclamationTriangle /> :
                       activity.action === "assigned" ? <FaTools /> :
                       <FaLaptop />}
                    </span>
                    <div className="activity-details">
                      <p className="activity-text">{activity.description}</p>
                      <span className="activity-time">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-activity">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
