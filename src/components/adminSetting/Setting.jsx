import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Setting.css";

const AdminSettings = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [message, setMessage] = useState("");
  const [adminData, setAdminData] = useState({
    name: storedUser?.name || "",
    email: storedUser?.email || "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (adminData.password !== adminData.confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userId = storedUser._id;

      const payload = {
        name: adminData.name,
        email: adminData.email,
        password: adminData.password,
      };

      console.log("Sending payload to backend:", payload); // Log the data

      const res = await fetch(`https://asset-management-backend-qezn.onrender.com/api/auth/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Backend response:", data); // Log the response

      if (res.ok) {
        setMessage("✅ Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(data));
        setAdminData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.log("Error during save:", err);
      setMessage("❌ Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });

    window.history.pushState(null, "", "/login");
    window.history.pushState(null, "", "/login");

    const handlePopState = () => {
      navigate("/login", { replace: true });
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  };

  return (
    <>
      <nav className="admin-navbar">
        <h2 className="admin-navbar-title">ADMIN PANEL</h2>
        <div className="admin-nav-links">
          <Link to="/manageasset">Manage Assets</Link>
          <Link to="/manageUsers">Manage Users</Link>
          <Link to="/AdminReq">Manage Requests</Link>
          <Link to="/AdminIssues">Issues</Link>
          <Link to="/adminSetting">Settings</Link>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <div className="admin-settings-container">
        <h2 className="admin-settings-title">Admin Settings</h2>
        {message && <p className="admin-settings-message">{message}</p>}

        <form className="admin-settings-form">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={adminData.name}
            onChange={handleChange}
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={adminData.email}
            onChange={handleChange}
          />

          <label>New Password:</label>
          <input
            type="password"
            name="password"
            value={adminData.password}
            onChange={handleChange}
            placeholder="Enter new password"
          />

          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={adminData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
          />

          <button type="button" className="admin-save-btn" onClick={handleSave}>
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminSettings;
