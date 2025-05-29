import React, { useState } from "react";
import { QrReader } from "@blackbox-vision/react-qr-reader";
import QuickActionsNavbar from "../quickActions/QuickActionsNavbar"; // Importing QuickActionsNavbar
import "./ScanQR.css";

const QRScanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleScan = (result, error) => {
    if (result?.text) {
      try {
        const parsedData = JSON.parse(result.text);
        setScannedData(parsedData);
        setErrorMsg("");
      } catch (err) {
        console.error("Invalid QR Data:", result.text);
        setErrorMsg("Invalid QR code data");
      }
    }
    if (error) {
      console.error("QR Scan Error:", error);
    }
  };

  const toggleScanner = () => {
    setIsScannerOpen((prevState) => !prevState); // Toggle the scanner visibility
  };

  return (
    <>
      <QuickActionsNavbar /> {/* Navbar component */}
      <div className="page-container">
        <h1>Scan QR Code</h1>
        <p>Use your camera to scan asset QR codes.</p>

        {/* Button to open/close scanner */}
        <button className="scan-btn" onClick={toggleScanner}>
          {isScannerOpen ? "Close Scanner" : "Open Scanner"}
        </button>

        {/* Show the scanner only when isScannerOpen is true */}
        {isScannerOpen && (
          <div className="scanner-box">
            <QrReader
              onResult={handleScan}
              constraints={{ facingMode: "environment" }}
              style={{ width: "100%" }}
            />
          </div>
        )}

        {errorMsg && <p className="error-message">{errorMsg}</p>}

        {scannedData ? (
          <div className="scan-result">
            <h3>Scanned Asset Details:</h3>
            <pre>{JSON.stringify(scannedData, null, 2)}</pre>
          </div>
        ) : (
          <p className="waiting-message">Waiting for QR scan...</p>
        )}
      </div>
    </>
  );
};

export default QRScanner;
