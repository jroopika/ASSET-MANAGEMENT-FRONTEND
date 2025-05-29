import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Button, Card, Container, Nav, Navbar, Table, Badge } from "react-bootstrap";
import { FaBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const HODNotifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    { id: 1, message: "Laptop request pending approval", is_read: false },
    { id: 2, message: "Projector request pending approval", is_read: false },
    { id: 3, message: "Printer request approved", is_read: true },
    { id: 4, message: "Mouse request rejected", is_read: true },
  ]);

  const unreadCount = notifications.filter((notif) => !notif.is_read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, is_read: true } : notif))
    );
  };

  const handleLogout = () => {
    localStorage.clear(); // Or remove only token: localStorage.removeItem("token")
    navigate("/login");
  };

  return (
    <div className="container-fluid p-0" style={{ background: "#121212", minHeight: "100vh" }}>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/hod">HOD Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/hod">Home</Nav.Link>
              <Nav.Link as={Link} to="/hodactivity">Activity Logs</Nav.Link>
              <Nav.Link as={Link} to="/hodSettings">Settings</Nav.Link>
              <Nav.Link as={Link} to="/hodnotifications">
                <FaBell />
                {unreadCount > 0 && <Badge bg="danger">{unreadCount}</Badge>}
              </Nav.Link>
              <Button variant="outline-danger" className="ms-3" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Notifications Section */}
      <Container className="mt-4 text-light">
        <Card bg="dark" text="light" className="mb-4 shadow-lg">
          <Card.Header className="text-center">🔔 Notifications</Card.Header>
          <Card.Body>
            {notifications.length > 0 ? (
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notif) => (
                    <tr key={notif.id}>
                      <td>{notif.message}</td>
                      <td>
                        <Badge bg={notif.is_read ? "success" : "warning"}>
                          {notif.is_read ? "Read" : "Unread"}
                        </Badge>
                      </td>
                      <td>
                        {!notif.is_read && (
                          <Button variant="success" size="sm" onClick={() => markAsRead(notif.id)}>
                            ✅ Mark as Read
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-center">No new notifications 📭</p>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default HODNotifications;
