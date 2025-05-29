import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createUser, deleteUser, getAllUsers, updateUser } from "../../services/api";
import "./ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // fixed to lowercase
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user = null) => {
    if (user) {
      setEditingUserId(user._id);
      setFormData({
        name: user.name,
        email: user.email,
        password: "", // Leave blank during edit
        role: user.role,
      });
    } else {
      setEditingUserId(null);
      setFormData({ name: "", email: "", password: "", role: "user" }); // fixed here too
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", email: "", password: "", role: "user" }); // fixed here too
    setEditingUserId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        await updateUser(editingUserId, formData);
      } else {
        await createUser(formData);
      }
      fetchUsers();
      closeModal();
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Error saving user. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="manage-users-container">
      <nav className="navbar">
        <h2 className="navbar-title">ADMIN PANEL</h2>
        <div className="nav-links">
          <Link to="/manageasset">Manage Assets</Link>
          <Link to="/manageUsers">Manage Users</Link>
          <Link to="/AdminReq">Manage Requests</Link>
          <Link to="/AdminIssues">Issues</Link>
          <Link to="/adminSetting">Settings</Link>
        </div>
      </nav>

      <h2>Manage Users</h2>
      <button className="add-user-btn" onClick={() => openModal()}>
        + Add User
      </button>

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td style={{ textAlign: "center" }}>
                    <button className="edit-btn" onClick={() => openModal(user)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(user._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-users">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingUserId ? "Edit User" : "Add User"}</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUserId ? "Leave blank to keep unchanged" : ""}
                  required={!editingUserId}
                />
              </label>
              <label>
                Role:
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value.toLowerCase() })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="hod">Hod</option>
                </select>
              </label>
              <div className="modal-actions">
                <button type="submit">{editingUserId ? "Save" : "Add"}</button>
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
