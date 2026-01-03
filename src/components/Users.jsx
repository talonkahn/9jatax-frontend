import React, { useState, useEffect } from "react";

const ROLES = {
  VIEWER: "Viewer",
  ACCOUNTANT: "Accountant",
  ADMIN: "Admin",
};

export default function Users() {
  const COMPANY_ID = localStorage.getItem("company_id");

  // Get logged-in user session
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const loggedUserId = storedUser?.id;
  const [userRole, setUserRole] = useState(storedUser?.role || ROLES.ADMIN);

  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: "", role: ROLES.VIEWER });
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;

  const isAdmin = userRole === ROLES.ADMIN;

  /* =====================
     FETCH USERS
  ===================== */
  const fetchUsers = async () => {
    if (!COMPANY_ID) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/company/${COMPANY_ID}`);
      const data = await res.json();

      // Ensure data is always an array
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH USERS ERROR:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* =====================
     ADD USER (ADMIN ONLY)
  ===================== */
  const handleAdd = async () => {
    if (!newUser.email) return alert("Email required");

    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: COMPANY_ID,
          user_email: newUser.email,
          role: newUser.role,
        }),
      });

      if (!res.ok) throw new Error("Failed to add user");

      setNewUser({ email: "", role: ROLES.VIEWER });
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  /* =====================
     ROLE CHANGE (ADMIN)
  ===================== */
  const handleRoleChange = async (userId, role) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) throw new Error("Failed to update role");

      // 🔥 If the logged-in user changes their own role, update session immediately
      if (userId === loggedUserId) {
        const updatedUser = { ...storedUser, role };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUserRole(role);
      }

      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  /* =====================
     DELETE USER (ADMIN)
  ===================== */
  const handleDelete = async (userId) => {
    if (!confirm("Delete this user?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  /* =====================
     VIEW-ONLY ACCESS FOR NON-ADMINS
  ===================== */
  if (!isAdmin) {
    return (
      <div className="card">
        <h2>Users</h2>
        <p>
          You have <strong>view-only access</strong>. Only Admins can manage users.
        </p>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.user_email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  /* =====================
     RENDER FOR ADMINS
  ===================== */
  return (
    <div className="users-page">
      <h2>Company Users</h2>

      <div className="user-add">
        <input
          type="email"
          placeholder="User email"
          value={newUser.email}

onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />

        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          {Object.values(ROLES).map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <button onClick={handleAdd}>Add User</button>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="3">No users found</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.user_email}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      {Object.values(ROLES).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(u.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}