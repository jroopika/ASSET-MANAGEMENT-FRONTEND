import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar bg="light" variant="light" expand="lg" className="landing-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/">Asset Management</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/about">About</Nav.Link>
              <Nav.Link as={Link} to="/features">Features</Nav.Link>
              <Nav.Link as={Link} to="/login">
                <Button variant="success">Login</Button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      // ... rest of the component
    </div>
  );
};

export default LandingPage; 