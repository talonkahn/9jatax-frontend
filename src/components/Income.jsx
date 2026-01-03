import React, { useState, useEffect } from "react";
import api from "../api";
import "./Income.css";

export default function Income() {
  const [income, setIncome] = useState([]);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Load recent income for logged-in company
  const loadIncome = async () => {
    try {
      const { data } = await api.get("/income");
      setIncome(data || []);
    } catch (err) {
      console.error("Failed to fetch income:", err.response?.data || err.message);
    }
  };

  const addIncome = async () => {
    if (!form.name  !form.amount  !form.date) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/income", {
        date: form.date,
        description: form.name,
        amount: Number(form.amount),
        incomeAccountCode: 4000, // Revenue
        paymentAccountCode: 1000, // Cash
      });

      setIncome((prev) => [
        {
          id: data.entryId,
          name: form.name,
          amount: Number(form.amount),
          date: form.date,
        },
        ...prev,
      ]);

      setForm({ name: "", amount: "", date: "" });
    } catch (err) {
      console.error("Failed to save income:", err.response?.data || err.message);
      alert("Failed to save income: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncome();
  }, []);

  return (
    <div className="income-container">
      <h1>Income</h1>
      <p className="inc-sub">Track money coming into your business.</p>

      <div className="inc-form">
        <input
          type="text"
          name="name"
          placeholder="Income source"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount (₦)"
          value={form.amount}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <button onClick={addIncome} disabled={loading}>
          {loading ? "Posting..." : "Add Income"}
        </button>
      </div>

      <h2 className="inc-section-title">Recent Income</h2>
      <div className="inc-list">
        {income.map((inc) => (
          <div className="inc-item" key={inc.id}>
            <div className="inc-left">
              <div className="inc-name">{inc.name}</div>
            </div>
            <div className="inc-right">
              <div className="inc-amt">₦{Number(inc.amount).toLocaleString()}</div>
              <div className="inc-date">{inc.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}