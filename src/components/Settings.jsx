import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import api from "../api";
import "./Settings.css";

export default function Settings() {
  const [hasCompany, setHasCompany] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/companies/me");
        setHasCompany(data.hasCompany);
      } catch {
        setHasCompany(false);
      }
    };
    load();
  }, []);

  if (hasCompany === null) return null;

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <p className="settings-sub">
        Manage your company, tax configuration, and system preferences.
      </p>

      <div className="settings-tabs">
        {!hasCompany && <NavLink to="company">Company</NavLink>}
        <NavLink to="users">Users</NavLink>
        <NavLink to="preferences">Preferences</NavLink>
      </div>

      <div className="settings-content">
        <Outlet />
      </div>
    </div>
  );
}