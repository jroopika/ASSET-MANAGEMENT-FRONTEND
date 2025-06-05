import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Hod.css";
import { Navbar, Container, Nav, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";

const Hod = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [assignedAssets, setAssignedAssets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchAllData = async () => {
    try {
      const pendingRes = await axios.get("https://asset-management-backend-crnj.onrender.com/api/requests/pending");
      setPendingRequests(pendingRes.data);

      const assignedRes = await axios.get("https://asset-management-backend-crnj.onrender.com/api/requests/approved");
      const formattedAssets = assignedRes.data.map(asset => ({
        _id: asset._id,
        asset: asset.assetType,
        user: asset.userId?.name || 'Unknown User',
        status: asset.status === "assigned" ? "Assigned" : "Approved"
      }));
      setAssignedAssets(formattedAssets);

      const notifRes = await axios.get("https://asset-management-backend-crnj.onrender.com/api/notifications");
      setNotifications(notifRes.data);
      setUnreadCount(notifRes.data.filter(n => !n.is_read).length);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line
  }, []);

  const handleApprove = async (_id) => {
    try {
      const requestToApprove = pendingRequests.find(req => req._id === _id);
      await axios.put(`https://asset-management-backend-crnj.onrender.com/api/requests/${_id}/approve`);
      const approvedAsset = {
        _id: _id,
        asset: requestToApprove.assetType,
        user: requestToApprove.userId?.name || 'Unknown User',
        status: "Approved"
      };
      setAssignedAssets([...assignedAssets, approvedAsset]);
      setPendingRequests(pendingRequests.filter(req => req._id !== _id));
      addNotification(`${requestToApprove.assetType} request approved for ${requestToApprove.userId?.name || 'Unknown User'}`);
      fetchAllData();
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  const handleReject = async (_id) => {
    try {
      const requestToReject = pendingRequests.find(req => req._id === _id);
      await axios.put(`https://asset-management-backend-crnj.onrender.com/api/requests/${_id}/reject`);
      setPendingRequests(pendingRequests.filter(req => req._id !== _id));
      addNotification(`Request for ${requestToReject.assetType} from ${requestToReject.userId?.name || 'Unknown User'} rejected`);
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  const addNotification = (message) => {
    const newNotif = { id: notifications.length + 1, message, is_read: false };
    setNotifications([...notifications, newNotif]);
    setUnreadCount(prev => prev + 1);
  };

  return (
    <div className="hod-dashboard">
      <Navbar bg="light" variant="light" expand="lg" className="custom-navbar">
        <Container fluid>
          <Navbar.Brand as={Link} to="/hod">HOD Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/hod">Home</Nav.Link>
              <Nav.Link as={Link} to="/hodActivity">Activity Logs</Nav.Link>
              <Nav.Link as={Link} to="/hodSettings">Settings</Nav.Link>
              <Nav.Link as={Link} to="/hodnotifications">
                <FaBell />
                {unreadCount > 0 && <Badge bg="danger">{unreadCount}</Badge>}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <section className="hod-section">
        <h2>Pending Requests</h2>
        <table className="hod-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>User</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-row">No pending requests</td>
              </tr>
            ) : (
              pendingRequests.map(req => (
                <tr key={req._id}>
                  <td>{req.assetType}</td>
                  <td>{req.userId?.name || 'Unknown User'}</td>
                  <td>{req.status}</td>
                  <td>
                    <button className="approve-btn" onClick={() => handleApprove(req._id)}>Approve</button>
                    <button className="reject-btn" onClick={() => handleReject(req._id)}>Reject</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section className="hod-section">
        <h2>Assigned/Approved Assets</h2>
        <table className="hod-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>User</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {assignedAssets.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty-row">No assigned assets</td>
              </tr>
            ) : (
              assignedAssets.map(asset => (
                <tr key={asset._id}>
                  <td>{asset.asset}</td>
                  <td>{asset.user}</td>
                  <td>{asset.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section className="hod-section">
        <h2>Notifications</h2>
        <ul className="hod-notif-list">
          {notifications.length === 0 ? (
            <li className="empty-row">No notifications</li>
          ) : (
            notifications.map((notif, idx) => (
              <li key={idx} className={notif.is_read ? "read" : "unread"}>
                {notif.message}
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
};

export default Hod;