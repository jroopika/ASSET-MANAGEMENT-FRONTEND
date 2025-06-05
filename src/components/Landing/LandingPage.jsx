import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  FaQrcode,
  FaLaptop,
  FaChartBar,
  FaMobileAlt,
  FaShieldAlt,
  FaTools,
  FaClipboardCheck,
  FaBars,
  FaTimes,
  FaWarehouse,
  FaHeadphones,
  FaKeyboard,
  FaMouse,
  FaDesktop,
  FaFileAlt,
  FaCog,
  FaRecycle,
  FaArrowRight,
} from "react-icons/fa"
import "./LandingPage.css"

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Smooth scrolling function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const navItems = [
    { id: "features", label: "Features" },
    { id: "assets", label: "Assets" },
    { id: "process", label: "Process" },
    { id: "reports", label: "Reports" },
  ]

  const assetTypes = [
    { icon: FaLaptop, label: "Laptops" },
    { icon: FaDesktop, label: "Printers" },
    { icon: FaShieldAlt, label: "Scanners" },
    { icon: FaClipboardCheck, label: "Projectors" },
    { icon: FaMouse, label: "Mouse" },
    { icon: FaKeyboard, label: "Keyboard" },
    { icon: FaHeadphones, label: "Headsets" },
    { icon: FaTools, label: "Peripherals" },
  ]

  const features = [
    {
      icon: FaQrcode,
      title: "QR Code Asset Tagging",
      description: "Each asset gets a unique QR code stored in the database for instant identification and tracking",
    },
    {
      icon: FaMobileAlt,
      title: "Mobile App Integration",
      description: "Scan QR codes via mobile app to report problems and track asset status in real-time",
    },
    {
      icon: FaWarehouse,
      title: "Centralized Distribution",
      description: "Assets are distributed through common store with centralized request processing",
    },
    {
      icon: FaChartBar,
      title: "Comprehensive Reports",
      description: "Generate reports for total assets, department-wise, AMC status, and end-of-service assets",
    },
  ]

  const processSteps = [
    {
      step: "01",
      title: "Request Aggregation",
      description: "Asset requests are collected and centrally processed for efficient handling",
    },
    {
      step: "02",
      title: "Asset Distribution",
      description: "Assets are distributed through the common store with proper documentation",
    },
    {
      step: "03",
      title: "QR Code Tagging",
      description: "Each asset receives a unique QR code and is registered in the database",
    },
    {
      step: "04",
      title: "Final Issuance",
      description: "Assets are issued to end users with complete tracking and accountability",
    },
  ]

  return (
    <div className="landing-page">
      {/* Enhanced Navbar */}
      <nav className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__container">
          <div className="navbar__logo-container">
            <Link to="/" className="navbar__logo">
              <FaQrcode className="navbar__logo-icon" />
              <span className="navbar__logo-text">AMS</span>
            </Link>
          </div>

          <button
            className="navbar__menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <ul className={`navbar__menu ${isMenuOpen ? "navbar__menu--active" : ""}`}>
            {navItems.map((item, index) => (
              <li key={index} className="navbar__item">
                <button className="navbar__link" onClick={() => scrollToSection(item.id)}>
                  {item.label}
                </button>
              </li>
            ))}
            <li className="navbar__item navbar__item--auth">
              <Link to="/login" className="navbar__link navbar__link--login">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section with Big Typography */}
      <section className="hero">
        <div className="hero__content">
          <div className="hero__badge">RP7001</div>
          <h1 className="hero__title">
            <span className="hero__title-large">Asset</span>
            <span className="hero__title-large hero__title-accent">Management</span>
            <span className="hero__title-large">System</span>
          </h1>
          <p className="hero__subtitle">
            Efficiently track, manage, and maintain organizational assets with QR code technology
          </p>
          <div className="hero__actions">
            <Link to="/login" className="btn btn--primary">
              Get Started <FaArrowRight className="btn__icon" />
            </Link>
            <button onClick={() => scrollToSection("features")} className="btn btn--secondary">
              Learn More
            </button>
          </div>
        </div>
        <div className="hero__background">
          <div className="hero__shape hero__shape--1"></div>
          <div className="hero__shape hero__shape--2"></div>
        </div>
      </section>

      {/* Features Section with Big Typography */}
      <section id="features" className="section features">
        <div className="container">
          <div className="section__header">
            <span className="section__eyebrow">Core Capabilities</span>
            <h2 className="section__title">
              <span className="text-accent">Key</span> Features
            </h2>
          </div>
          <div className="features__grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-card__header">
                  <feature.icon className="feature-card__icon" />
                  <h3 className="feature-card__title">{feature.title}</h3>
                </div>
                <p className="feature-card__description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Asset Types Section */}
      <section id="assets" className="section asset-types">
        <div className="container">
          <div className="section__header">
            <span className="section__eyebrow">What We Track</span>
            <h2 className="section__title">
              Supported <span className="text-accent">Assets</span>
            </h2>
          </div>
          <div className="asset-types__grid">
            {assetTypes.map((asset, index) => (
              <div key={index} className="asset-type-card">
                <asset.icon className="asset-type-card__icon" />
                <span className="asset-type-card__label">{asset.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="section process">
        <div className="container">
          <div className="section__header">
            <span className="section__eyebrow">How It Works</span>
            <h2 className="section__title">
              <span className="text-accent">Management</span> Process
            </h2>
          </div>
          <div className="process__grid">
            {processSteps.map((step, index) => (
              <div key={index} className="process-card">
                <div className="process-card__step">{step.step}</div>
                <h3 className="process-card__title">{step.title}</h3>
                <p className="process-card__description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reports & Mobile App Combined Section */}
      <section id="reports" className="section reports-mobile">
        <div className="container">
          <div className="section__header">
            <span className="section__eyebrow">Insights & Access</span>
            <h2 className="section__title">
              <span className="text-accent">Reports</span> & Mobile App
            </h2>
          </div>
          <div className="reports-mobile__grid">
            <div className="reports-section">
              <div className="reports__list">
                <div className="report-item">
                  <FaFileAlt className="report-item__icon" />
                  <div>
                    <h4>Total Assets Report</h4>
                    <p>Complete overview of all organizational assets</p>
                  </div>
                </div>
                <div className="report-item">
                  <FaChartBar className="report-item__icon" />
                  <div>
                    <h4>Department-wise Reports</h4>
                    <p>Asset allocation for specific departments</p>
                  </div>
                </div>
                <div className="report-item">
                  <FaCog className="report-item__icon" />
                  <div>
                    <h4>AMC Status Reports</h4>
                    <p>Maintenance contract status and schedules</p>
                  </div>
                </div>
                <div className="report-item">
                  <FaRecycle className="report-item__icon" />
                  <div>
                    <h4>End-of-Service Reports</h4>
                    <p>Assets requiring disposal or replacement</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mobile-section">
              <div className="mobile-phone">
                <div className="mobile-phone__screen">
                  <div className="mobile-phone__content">
                    <FaQrcode className="mobile-phone__qr-icon" />
                    <h3>Scan QR Code</h3>
                    <p>Report problems instantly</p>
                  </div>
                </div>
              </div>
              <div className="mobile__features">
                <div className="mobile__feature">
                  <FaQrcode />
                  <span>QR Scanning</span>
                </div>
                <div className="mobile__feature">
                  <FaTools />
                  <span>Problem Reporting</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
