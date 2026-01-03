import React, { useState, useEffect } from "react";

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
      const res = await fetch(`http://localhost:4000/api/preferences/${COMPANY_ID}`);
      const data = await res.json();
      if (data) setPrefs(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchPrefs(); }, []);

  const handleSave = async () => {
    try {
      await fetch("http://localhost:4000/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id: COMPANY_ID, ...prefs }),
      });
      alert("Preferences saved");
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <h2>Company Preferences</h2>

      <label>
        Default Currency:
        <input value={prefs.default_currency} onChange={e => setPrefs({ ...prefs, default_currency: e.target.value })}/>
      </label>

      <label>
        Timezone:
        <input value={prefs.timezone} onChange={e => setPrefs({ ...prefs, timezone: e.target.value })}/>
      </label>

      <label>
        Date Format:
        <input value={prefs.date_format} onChange={e => setPrefs({ ...prefs, date_format: e.target.value })}/>
      </label>

      <button onClick={handleSave}>Save Preferences</button>
    </div>
  );
}
