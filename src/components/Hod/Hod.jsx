import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { Button, Card, Container, Nav, Navbar, Table, Badge } from "react-bootstrap";
import { FaBell, FaCheck, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import './Hod.css';

const HODDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [assignedAssets, setAssignedAssets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Function to fetch all data including assigned assets
  const fetchAllData = async () => {
    try {
      // Fetch pending requests
      const pendingRes = await axios.get("https://asset-management-backend-qezn.onrender.com/api/requests/pending");
      setPendingRequests(pendingRes.data);

      // Fetch assigned assets - this should be a dedicated endpoint that returns all approved/assigned assets
      const assignedRes = await axios.get("https://asset-management-backend-qezn.onrender.com/api/requests/approved");
      
      // Transform the data to match the expected format for display
      const formattedAssets = assignedRes.data.map(asset => ({
        _id: asset._id,
        asset: asset.assetType,
        user: asset.userId?.name || 'Unknown User',
        status: asset.status === "assigned" ? "Assigned" : "Approved"
      }));
      
      setAssignedAssets(formattedAssets);

      // Fetch notifications
      const notifRes = await axios.get("https://asset-management-backend-qezn.onrender.com/api/notifications");
      setNotifications(notifRes.data);
      setUnreadCount(notifRes.data.filter(n => !n.is_read).length);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    // Call the fetch function when component mounts
    fetchAllData();
  }, []);

  const handleApprove = async (_id) => {
    try {
      // Find the request that's being approved
      const requestToApprove = pendingRequests.find(req => req._id === _id);
      
      // Call the API to approve the request
      await axios.put(`https://asset-management-backend-qezn.onrender.com/api/requests/${_id}/approve`);
      
      // Create a properly formatted asset entry with the correct user and asset info
      const approvedAsset = {
        _id: _id,
        asset: requestToApprove.assetType,
        user: requestToApprove.userId?.name || 'Unknown User',
        status: "Approved"
      };

      // Update the local state
      setAssignedAssets([...assignedAssets, approvedAsset]);
      setPendingRequests(pendingRequests.filter(req => req._id !== _id));
      
      // Add notification
      addNotification(`${requestToApprove.assetType} request approved for ${requestToApprove.userId?.name || 'Unknown User'}`);
      
      // Refresh all data to ensure consistency
      fetchAllData();
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  const handleReject = async (_id) => {
    try {
      // Find the request that's being rejected
      const requestToReject = pendingRequests.find(req => req._id === _id);
      
      // Call the API to reject the request
      await axios.put(`https://asset-management-backend-qezn.onrender.com/api/requests/${_id}/reject`);
      
      // Update the local state
      setPendingRequests(pendingRequests.filter(req => req._id !== _id));
      
      // Add notification
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
    <div className="hod-dashboard" style={{ minHeight: "100vh" }}>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
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

      <Container className="mt-4 text-light">
        <h2 className="mb-4">HOD Dashboard</h2>

        <div className="row g-4">
          {/* Pending Requests */}
          <div className="col-12 col-md-6 col-lg-4">
            <Card bg="dark" text="light" className="shadow-lg">
              <Card.Header className="text-center">📋 Pending Asset Requests</Card.Header>
              <Card.Body>
                {pendingRequests.length > 0 ? (
                  <Table striped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Asset</th>
                        <th>User</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingRequests.map((req, index) => (
                        <tr key={req._id}>
                          <td>{index + 1}</td>
                          <td>{req.assetType || 'N/A'}</td>
                          <td>{req.userId?.name || 'N/A'}</td>
                          <td>
                            <Button variant="success" size="sm" className="me-2" onClick={() => handleApprove(req._id)}>
                              <FaCheck /> Approve
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleReject(req._id)}>
                              <FaTimes /> Reject
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-center">✅ No pending requests</p>
                )}
              </Card.Body>
            </Card>
          </div>

          {/* Assigned Assets */}
          <div className="col-12 col-md-6 col-lg-4">
            <Card bg="dark" text="light">
              <Card.Header className="text-center">✅ Assigned Assets</Card.Header>
              <Card.Body>
                {assignedAssets.length > 0 ? (
                  <Table striped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Asset</th>
                        <th>User</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedAssets.map((asset, index) => (
                        <tr key={asset._id}>
                          <td>{index + 1}</td>
                          <td>{asset.asset}</td>
                          <td>{asset.user}</td>
                          <td>
                            <Badge bg="success">{asset.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-center">No assigned assets</p>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HODDashboard;
