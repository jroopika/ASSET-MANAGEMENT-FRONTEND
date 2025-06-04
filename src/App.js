import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminIssues from './components/AdminIssues/IssuesPage';  // Fixed typo here
import Dashboard from './components/adminDash/Dashboard';
import LandingPage from './components/Landing/LandingPage';
import LoginPage from './components/Login/login';
import ManageAssets from './components/manageasset/ManageAssets';
import ManageUsers from './components/manageUsers/ManageUsers';
import Settings from './components/adminSetting/Setting';
import HODDashboard from './components/Hod/Hod';
import HodSettings from './components/hodSettings/HodSetting';
import HODNotifications from './components/hodnotifications/hodNotifications';
import HODActivityLogs from './components/hodActivity/ActivityLogs';
import UserDashboard from "./components/userDash/UserDashboard";
import Profile from './components/Profile/Profile';
import RequestAsset from "./components/requestAsset/RequestAsset";
import ScanQR from "./components/scanQR/ScanQR";
import ReportIssue from "./components/reportIssue/ReportIssue";
import UserActivityLogs from "./components/userActivityLogs/UserActivityLogs";
import AssetDetails from "./components/AssetDetails"; // AssetDetails import
import AdminRequests from './components/AdminReq/AdminRequests';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manageasset" element={<ManageAssets />} />
          <Route path="/manageUsers" element={<ManageUsers />} />
          <Route path="/AdminIssues" element={<AdminIssues />} /> {/* Admin Issues Route */}
          <Route path="/adminSetting" element={<Settings />} />
          <Route path="/hod" element={<HODDashboard />} />
          <Route path="/hodSettings" element={<HodSettings />} />
          <Route path="/hodnotifications" element={<HODNotifications />} />
          <Route path="/hodActivity" element={<HODActivityLogs />} />
          <Route path="/userDashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/requestAsset" element={<RequestAsset />} />
          <Route path="/scanQR" element={<ScanQR />} />
          <Route path="/reportIssue" element={<ReportIssue />} />
          <Route path="/userActivityLogs" element={<UserActivityLogs />} />
          <Route path="/asset/:assetId" element={<AssetDetails />} />
          <Route path="/AdminReq" element={<AdminRequests />} />
          <Route path="/report-issue/:assetId" element={<ReportIssue />} />

          {/* Fallback route */}
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
