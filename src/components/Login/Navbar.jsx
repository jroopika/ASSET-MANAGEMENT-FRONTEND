import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import './Navbar.css';

const HODNavbar = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(3);
  }, []);

  return (
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
              {unreadCount > 0 && <Badge bg="danger" className="ms-1">{unreadCount}</Badge>}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HODNavbar;
