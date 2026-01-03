import React, { useEffect, useState } from "react";
import api from "../api";
import "./IncomeStatement.css";

export default function IncomeStatement() {
  const [statement, setStatement] = useState({ income: 0, expenses: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStatement = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/reports/income-statement");
      setStatement({
        income: Number(data.income || 0),
        expenses: Number(data.expenses || 0),
      });
    } catch (err) {
      console.error("Income statement error:", err.response?.data || err.message);
      setError("Failed to fetch income statement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatement();
  }, []);

  if (loading) return <p>Loading income statement...</p>;
  if (error) return <div className="is-error">{error}</div>;

  const netProfit = statement.income - statement.expenses;

  const formatCurrency = (n) =>
    n.toLocaleString("en-NG", { style: "currency", currency: "NGN" });

  return (
    <div className="is-container">
      <h1>Income Statement (P&L)</h1>

      <div className="is-row">
        <span>Total Income</span>
        <span>{formatCurrency(statement.income)}</span>
      </div>

      <div className="is-row">
        <span>Total Expenses</span>
        <span>{formatCurrency(statement.expenses)}</span>
      </div>

      <div className="is-row is-highlight2">
        <span>Net Profit</span>
        <span>{formatCurrency(netProfit)}</span>
      </div>
    </div>
  );
}