import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Badge, Button, Card, Container, Form, Nav, Navbar } from "react-bootstrap";
import { FaBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./HodSetting.css";

const HODSettings = () => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [message, setMessage] = useState("");
  const [hodData, setHodData] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
    password: "",
    confirmPassword: "",
  });

  const [unreadCount] = useState(3); // Example unread notifications count
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHodData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (hodData.password && hodData.password !== hodData.confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = storedUser._id;

    if (!token || !userId) {
      setMessage("❌ Authentication required. Please log in again.");
      return;
    }

    const payload = {
      name: hodData.name,
      email: hodData.email,
    };
    if (hodData.password) {
      payload.password = hodData.password;
    }

    try {
      const apiBaseUrl = process.env.REACT_APP_API_URL || "https://asset-management-backend-crnj.onrender.com";
      const url = `${apiBaseUrl}/api/auth/users/${userId}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      const contentType = response.headers.get("Content-Type");
      console.log("Content-Type:", contentType);

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        setMessage(`❌ Server returned non-JSON response: ${response.status}`);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setMessage(`❌ ${data.message || "Error updating profile"}`);
        return;
      }

      // Update localStorage with new user data
      const updatedUser = {
        _id: userId,
        name: data.name,
        email: data.email,
        role: data.role,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update state and clear password fields
      setHodData({
        name: data.name,
        email: data.email,
        password: "",
        confirmPassword: "",
      });
      setMessage("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("❌ Server error");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="hod-settings-container">
      <Navbar className="hod-navbar" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/hod">
            HOD Dashboard
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/hod">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/hodActivity">
                Activity Logs
              </Nav.Link>
              <Nav.Link as={Link} to="/hodSettings">
                Settings
              </Nav.Link>
              <Nav.Link as={Link} to="/hodnotifications" className="hod-notification">
                <FaBell />
                {unreadCount > 0 && <Badge className="badge">{unreadCount}</Badge>}
              </Nav.Link>
              <Button className="hod-logout-btn ms-3" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="container mt-4 text-light">
        <h2 className="mb-4">HOD Settings</h2>
        {message && <p className="alert hod-alert">{message}</p>}

        <Card className="hod-card mb-4">
          <Card.Header className="hod-card-header">Personal Information</Card.Header>
          <Card.Body>
            <Form className="hod-form">
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={hodData.name}
                  onChange={handleChange}
                  placeholder="Enter Name"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={hodData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={hodData.password}
                  onChange={handleChange}
                  placeholder="Enter New Password"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={hodData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm New Password"
                />
              </Form.Group>

              <Button className="hod-save-btn" onClick={handleSave}>
                Save Changes
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default HODSettings;