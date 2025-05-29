import React, { useEffect, useState } from "react";
import QuickActionsNavbar from "../quickActions/QuickActionsNavbar";
import "./Profile.css";

const Profile = () => {
  // Initialize user state with empty values or localStorage data if available
  const [user, setUser] = useState({
    _id: "",
    name: "",
    email: "",
    password: "********", // Hiding real password
  });

  const [editMode, setEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // Fetch user data from localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        // Safely parse user data
        const parsedUser = JSON.parse(userData);
        setUser({
          _id: parsedUser._id || "",
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          password: "********", // Hide password by default
        });
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  // Handle input change for name and email
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  // Handle save button click
  const handleSave = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    // Prepare update data
    const updateData = {
      name: user.name,
      email: user.email,
    };
    if (newPassword) {
      updateData.password = newPassword;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("❌ No authentication token found");
        return;
      }

      // Use environment variable for API base URL or fallback to localhost
      const apiBaseUrl = process.env.REACT_APP_API_URL || "https://asset-management-backend-qezn.onrender.com";
      const url = `${apiBaseUrl}/api/auth/users/${user._id}`;

      // Send update request to backend
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      // Log response for debugging
      console.log("Response status:", response.status);
      const contentType = response.headers.get("Content-Type");
      console.log("Content-Type:", contentType);

      // Check if response is JSON
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        setMessage(`❌ Server returned non-JSON response: ${response.status}`);
        return;
      }

      const result = await response.json();
      if (!response.ok) {
        setMessage(`❌ ${result.message || "Error updating profile"}`);
        return;
      }

      // Update localStorage with new user data
      const updatedUser = {
        _id: user._id,
        name: result.name,
        email: result.email,
        role: result.role,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update state
      setUser((prev) => ({
        ...prev,
        name: result.name,
        email: result.email,
        password: newPassword ? "********" : prev.password,
      }));

      // Clear password fields and exit edit mode
      setNewPassword("");
      setConfirmPassword("");
      setEditMode(false);
      setMessage("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("❌ Server error");
    }
  };

  return (
    <>
      <QuickActionsNavbar />
      <div className="user-profile-container">
        <h2 className="user-profile-title">User Profile</h2>
        {message && <p className="user-profile-message">{message}</p>}

        <label className="user-profile-label">Name:</label>
        {editMode ? (
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="user-profile-input"
          />
        ) : (
          <p>{user.name}</p>
        )}

        <label className="user-profile-label">Email:</label>
        {editMode ? (
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="user-profile-input"
          />
        ) : (
          <p>{user.email}</p>
        )}

        <label className="user-profile-label">Password:</label>
        {editMode ? (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="user-profile-input"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="user-profile-input mt-2"
            />
          </>
        ) : (
          <p>{user.password}</p>
        )}

        {editMode ? (
          <button
            className="user-profile-btn user-profile-save-btn"
            onClick={handleSave}
          >
            Save Changes
          </button>
        ) : (
          <button
            className="user-profile-btn user-profile-edit-btn"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
    </>
  );
};

export default Profile;