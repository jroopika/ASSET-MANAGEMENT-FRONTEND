import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './IssuesPage.css'; // Make sure you have some styles

const IssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch issues from backend
    axios.get('https://asset-management-backend-crnj.onrender.com/api/issues')
      .then(response => {
        setIssues(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching issues:', error);
        setLoading(false);
      });
  }, []);

  const handleResolve = (issueId) => {
    // Mark issue as resolved
    axios.put(`https://asset-management-backend-crnj.onrender.com/api/issues/${issueId}/resolve`)
      .then(response => {
        setIssues(issues.map(issue =>
          issue._id === issueId ? { ...issue, status: 'resolved' } : issue
        ));
      })
      .catch(error => {
        console.error('Error resolving issue:', error);
      });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading issues...</p>
      </div>
    );
  }

  return (
    <div className="issues-page">
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

      <h2>Reported Issues</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Asset Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
            <th>Reported By</th>
          </tr>
        </thead>
        <tbody>
          {issues.map(issue => (
            <tr key={issue._id}>
              <td>{issue.assetId ? issue.assetId.name : "Unknown Asset"}</td>
              <td>{issue.description}</td>
              <td>
                {issue.status === 'resolved' ? (
                  <span className="badge badge-success">Resolved</span>
                ) : (
                  <span className="badge badge-warning">Pending</span>
                )}
              </td>
              <td>
                {issue.status !== 'resolved' && (
                  <button onClick={() => handleResolve(issue._id)} className="btn btn-success">
                    Resolve
                  </button>
                )}
              </td>
              <td>{issue.userId ? issue.userId.name : "Unknown User"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IssuesPage;
