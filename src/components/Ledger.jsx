import React, { useEffect, useState } from "react";
import api from "../api";
import "./Ledger.css";

export default function Ledger() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLedger = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/ledger");
      setEntries(data || []);
    } catch (err) {
      console.error("Ledger load failed:", err.response?.data || err.message);
      setError("Failed to load ledger entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLedger();
  }, []);

  if (loading) return <div className="ledger-container">Loading ledger…</div>;
  if (error) return <div className="ledger-error">{error}</div>;

  return (
    <div className="ledger-container">
      <h1>General Ledger</h1>
      <p className="ledger-sub">Every transaction, double-entry verified.</p>

      {entries.length === 0 && (
        <div className="ledger-empty">No ledger entries yet.</div>
      )}

      {entries.map((entry) => (
        <div className="ledger-entry" key={entry.id}>
          <div className="ledger-header">
            <div>
              <strong>{entry.description}</strong>
              <div className="ledger-date">{entry.date}</div>
            </div>
            <span className={`ledger-status ${entry.status}`}>
              {entry.status}
            </span>
          </div>

          <table className="ledger-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Debit (₦)</th>
                <th>Credit (₦)</th>
              </tr>
            </thead>
            <tbody>
              {entry.lines.map((line, i) => (
                <tr key={i}>
                  <td>
                    {line.account_name} ({line.account_code})
                  </td>
                  <td className="debit">
                    {line.debit > 0 ? line.debit.toLocaleString() : ""}
                  </td>
                  <td className="credit">
                    {line.credit > 0 ? line.credit.toLocaleString() : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}