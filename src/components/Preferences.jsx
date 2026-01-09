import React, { useState, useEffect } from "react";
import api from "../api"; // Use your axios instance

export default function Preferences() {
  const COMPANY_ID = localStorage.getItem("company_id");
  const [prefs, setPrefs] = useState({
    default_currency: "₦",
    timezone: "Africa/Lagos",
    date_format: "MM/DD/YYYY",
  });

  const fetchPrefs = async () => {
    if (!COMPANY_ID) return;
    try {
      const { data } = await api.get(`/preferences/${COMPANY_ID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("9jatax_token")}`,
        },
      });
      if (data) setPrefs(data);
    } catch (err) {
      console.error("Fetch preferences failed:", err);
    }
  };

  useEffect(() => {
    fetchPrefs();
  }, []);

  const handleSave = async () => {
    try {
      await api.post(
        "/preferences",
        { company_id: COMPANY_ID, ...prefs },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("9jatax_token")}`,
          },
        }
      );
      alert("Preferences saved");
    } catch (err) {
      console.error("Save preferences failed:", err);
    }
  };

  return (
    <div>
      <h2>Company Preferences</h2>

      <label>
        Default Currency:
        <input
          value={prefs.default_currency}
          onChange={(e) =>
            setPrefs({ ...prefs, default_currency: e.target.value })
          }
        />
      </label>

      <label>
        Timezone:
        <input
          value={prefs.timezone}
          onChange={(e) => setPrefs({ ...prefs, timezone: e.target.value })}
        />
      </label>

      <label>
        Date Format:
        <input
          value={prefs.date_format}
          onChange={(e) =>
            setPrefs({ ...prefs, date_format: e.target.value })
          }
        />
      </label>

      <button onClick={handleSave}>Save Preferences</button>
    </div>
  );
}