import React, { useEffect, useState } from "react";
import api from "../api";
import "./BalanceSheet.css";

export default function BalanceSheet() {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBalances = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/reports/balance-sheet");

      // ✅ Ensure we always have an array
      const normalizedData = Array.isArray(data) ? data : [];
      setBalances(normalizedData);
    } catch (err) {
      console.error("Balance sheet fetch error:", err.response?.data || err.message);
      setError("Failed to fetch balance sheet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBalances();
  }, []);

  if (loading) return <h1>Loading Balance Sheet...</h1>;
  if (error) return <div className="bs-error">{error}</div>;

  // ✅ Map backend 'category' to frontend
  const assetBalance = Number(balances.find(b => b.category === "asset")?.balance || 0);
  const liabilityBalance = Number(balances.find(b => b.category === "liability")?.balance || 0);
  const equityBalance = Number(balances.find(b => b.category === "equity")?.balance || 0);

  const balanced = Math.abs(assetBalance - (liabilityBalance + equityBalance)) < 1;

  return (
    <div className="bs-container">
      <h1>Balance Sheet</h1>

      <div className="bs-cards">
        <div className="bs-card bs-assets">
          <span className="bs-label">Assets</span>
          <span className="bs-value">
            ₦{assetBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="bs-card bs-liabilities">
          <span className="bs-label">Liabilities</span>
          <span className="bs-value">
            ₦{liabilityBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="bs-card bs-equity">
          <span className="bs-label">Equity</span>
          <span className="bs-value">
            ₦{equityBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className={`bs-status ${balanced ? "balanced" : "not-balanced"}`}>
        {balanced ? "Balanced ✅" : "Not Balanced ⚠️"}
      </div>
    </div>
  );
}