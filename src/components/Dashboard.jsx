import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import {
  FaArrowUp,
  FaArrowDown,
  FaWallet,
  FaFileInvoice,
  FaLock,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api"; // ✅ Use centralized API (Render backend + JWT handled)

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    income: 0,
    expenses: 0,
    profit: 0,
    invoices: 0,
  });
  const [recent, setRecent] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Check token and company ID
    const TOKEN = localStorage.getItem("9jatax_token");
    const COMPANY_ID = localStorage.getItem("company_id");

    if (!TOKEN || !COMPANY_ID) {
      navigate("/login");
      return;
    }

    async function loadDashboard() {
      try {
        // ✅ Use api.js instead of fetch with localhost
        const { data } = await api.get("/reports/dashboard");

        setStats({
          income: Number(data.income ?? 0),
          expenses: Number(data.expenses ?? 0),
          profit: Number(data.profit ?? 0),
          invoices: Number(data.invoices ?? 0),
        });

        setRecent(
          Array.isArray(data.recent)
            ? data.recent.map((r) => ({
                id: r.id,
                date: r.date,
                name: r.description || "Transaction",
                amount: Number(r.amount),
                type: r.type, // use backend type directly
              }))
            : []
        );
      } catch (err) {
        console.error("DASHBOARD ERROR:", err.response?.data || err.message);
        setStats({ income: 0, expenses: 0, profit: 0, invoices: 0 });
        setRecent([]);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [navigate]);

  const visibleRecent = showAll ? recent : recent.slice(0, 5);

  if (loading) return <h1>Loading Dashboard...</h1>;

  return (
    <div className="dash-container">
      <h1>Dashboard</h1>
      <p className="dash-sub">Your financial overview at a glance.</p>

      <div className="dash-cards">
        <div className="dash-card" onClick={() => navigate("/income-statement")}>
          <FaWallet className="dash-icon" />
          <h3>Income</h3>
          <div className="dash-amount">₦{stats.income.toLocaleString()}</div>
          <div className="dash-positive"><FaArrowUp /> Real data</div>
        </div>

        <div className="dash-card" onClick={() => navigate("/expenses")}>
          <FaWallet className="dash-icon" />
          <h3>Expenses</h3>
          <div className="dash-amount red">₦{stats.expenses.toLocaleString()}</div>
          <div className="dash-negative"><FaArrowDown /> Real data</div>
        </div>

        <div className="dash-card" onClick={() => navigate("/ledger")}>
          <FaWallet className="dash-icon" />
          <h3>Profit</h3>
          <div className="dash-amount">₦{stats.profit.toLocaleString()}</div>
        </div>

        <div className="dash-card" onClick={() => navigate("/invoices")}>
          <FaFileInvoice className="dash-icon" />
          <h3>Invoices</h3>
          <div className="dash-amount">{stats.invoices}</div>
        </div>

        <div className="dash-card dash-premium">
          <FaLock className="dash-icon" />
          <h3>Advanced Analytics</h3>
          <div className="dash-amount">Locked</div>
          <div className="dash-negative"><FaLock /> Premium Feature</div>
        </div>
      </div>

      <h2 className="dash-section-title">Recent Activity</h2>

      {visibleRecent.length === 0 ? (
        <p>No recent activity yet.</p>
      ) : (
        <div className="dash-activity">
          {visibleRecent.map((item) => (
            <div className="dash-item" key={item.id}>
              <div className="dash-item-main">
                <div className="dash-item-name">{item.name}</div>
                <div className="dash-item-type">{item.

type}</div>
              </div>
              <div className="dash-item-side">
                <div
                  className={`dash-item-amt ${
                    item.type === "Expense" ? "red" : "green"
                  }`}
                >
                  ₦{Math.abs(item.amount).toLocaleString()}
                </div>
                <div className="dash-item-date">
                  {new Date(item.date).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {recent.length > 5 && (
        <div className="dash-show-more">
          <button onClick={() => setShowAll((v) => !v)}>
            {showAll ? <>Show less <FaChevronUp /></> : <>Show more ({recent.length - 5}) <FaChevronDown /></>}
          </button>
        </div>
      )}
    </div>
  );
}