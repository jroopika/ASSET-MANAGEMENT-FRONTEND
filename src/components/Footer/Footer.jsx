import React from "react";
import { Container } from "react-bootstrap";
import "./Footer.css"; // Import styles

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <p>&copy; {new Date().getFullYear()} Asset Management System. All Rights Reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;
