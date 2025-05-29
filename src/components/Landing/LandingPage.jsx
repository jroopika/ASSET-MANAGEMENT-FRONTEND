import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import logo from './logo.webp';

const LandingPage = () => {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page" style={{ fontFamily: "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif" }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
          <img src={logo} alt="Logo" className="navbar-logo" />
          <a className="navbar-brand" href="#">Asset Management</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><a className="nav-link" href="#features">Features</a></li>
              <li className="nav-item"><a className="nav-link" href="#about">About</a></li>
              
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section d-flex">
        <div className="hero-content d-flex align-items-center justify-content-center">
          <div className="text-container text-center">
            <h1 className="hero-title">Experience Next-Level Asset Management</h1>
            <p className="hero-subtitle">Simplify how you track and manage your assets with our state-of-the-art platform.</p>
          </div>
        </div>
        <div className="get-started-section d-flex align-items-center justify-content-center">
          <div className="text-center">
            <h2 className="get-started-title">Ready to Get Started?</h2>
            <p className="get-started-description">Sign up today and revolutionize the way you manage your assets.</p>
            <Link to="/login" className="btn btn-animated">Get Started</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">Features</h2>
          <p className="section-description">Explore our powerful features designed to help you manage your assets effortlessly.</p>
          <div className="row">
            <div className="col-md-6 col-lg-4">
              
                <div className="card-body">
                  <h5 className="card-title">Real-time Asset Tracking</h5>
                  <p className="card-text">Track all your assets in real-time with detailed information and updates.</p>
                </div>
              
            </div>
            <div className="col-md-6 col-lg-4">
              
                <div className="card-body">
                  <h5 className="card-title">Detailed Analytics and Reporting</h5>
                  <p className="card-text">Get comprehensive insights with visual analytics and detailed reports.</p>
                </div>
              
            </div>
            <div className="col-md-6 col-lg-4">
              
                <div className="card-body">
                  <h5 className="card-title">Customizable Alerts</h5>
                  <p className="card-text">Set alerts and notifications to stay informed about important changes.</p>
                </div>
              
            </div>
          </div>
        </div>
      </section>

     {/* About Section */}
<section id="about" className="about-section">
  <div className="container">
    <h2 className="section-title">About Us</h2>
    
      <div className="card-body">
      <h5 className="card-title">Our mission</h5>
      <p className="card-text">
          To simplify asset management for individuals and businesses through innovative technology and intuitive design.
        </p>
      </div>
    
    
      <div className="card-body">
        <h5 className="card-title">Our Vision</h5>
        <p className="card-text">
          Empowering businesses with the tools they need to manage assets efficiently and securely.
        </p>
      </div>
    
  </div>
</section>

      {/* Footer Section */}
      <footer className="footer bg-dark text-light py-4">
        <div className="container text-center">
          <p>&copy; 2025 Asset Management. All rights reserved.</p>

        </div>
      </footer>
    </div>
  );
};

export default LandingPage;