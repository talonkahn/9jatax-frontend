import React, { useState, useEffect } from "react";
import api from "../api";
import "./Expenses.css";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    amount: "",
    date: "",
  });

  const COA_MAP = {
    Operations: { code: 5200, name: "Operating Expenses" },
    Rent: { code: 5100, name: "Rent Expense" },
    Utilities: { code: 5300, name: "Utilities Expense" },
    Maintenance: { code: 5400, name: "Maintenance Expense" },
    Staff: { code: 5500, name: "Staff Costs" },
  };

  // Load recent expenses for this company
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { data } = await api.get("/expenses/company");
        const mapped = data.map((e) => ({
          id: e.id,
          name: e.name,
          category: e.category,
          amount: Number(e.amount),
          date: e.date,
        }));
        setExpenses(mapped);
      } catch (err) {
        console.error("EXPENSE FETCH ERROR:", err.response?.data || err.message);
      }
    };

    fetchExpenses();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addExpense = async () => {
    if (!form.name || !form.amount || !form.date || !form.category) {
      alert("Fill all fields");
      return;
    }

    const payload = {
      date: form.date,
      description: form.name,
      amount: Number(form.amount),
      expenseAccountCode: COA_MAP[form.category].code,
      paymentAccountCode: 1000,
    };

    try {
      const { data } = await api.post("/expenses", payload);

      // Update recent expenses immediately
      setExpenses((prev) => [
        {
          id: data.entryId,
          name: form.name,
          category: form.category,
          amount: Number(form.amount),
          date: form.date,
        },
        ...prev,
      ]);

      setForm({ name: "", category: "", amount: "", date: "" });
    } catch (err) {
      alert("Failed to save expense: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="expenses-container">
      <h1>Expenses</h1>
      <p className="exp-sub">Track and manage your business spending.</p>

      <div className="exp-form">
        <input type="text" name="name" placeholder="Expense name" value={form.name} onChange={handleChange} />

        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Select category</option>
          {Object.keys(COA_MAP).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input type="number" name="amount" placeholder="Amount (₦)" value={form.amount} onChange={handleChange} />
        <input type="date" name="date" value={form.date} onChange={handleChange} />

        <button onClick={addExpense}>Add Expense</button>
      </div>

      <label className="exp-preview-toggle">
        <input type="checkbox" checked={showPreview} onChange={() => setShowPreview(!showPreview)} />
        Preview Ledger Entry
      </label>

      {showPreview && form.amount && form.category && (
        <div className="ledger-preview">
          <h3>Ledger Preview</h3>
          <div className="ledger-row debit">
            <span>Debit</span>
            <span>{COA_MAP[form.category].name} ({COA_MAP[form.category].code})</span>
            <span>₦{Number(form.amount).toLocaleString()}</span>
          </div>
          <div className="ledger-row credit">
            <span>Credit</span>
            <span>Cash (1000)</span>
            <span>₦{Number(form.amount).toLocaleString()}</span>
          </div>
        </div>
      )}

      <h2 className="exp-section-title">Recent Expenses</h2>
      <div className="exp-list">
        {expenses.map((exp) => (
          <div className="exp-item" key={exp.id}>
            <div className="exp-left">
              <div className="exp-name">{exp.name}</div>

<div className="exp-cat">{exp.category}</div>
            </div>
            <div className="exp-right">
              <div className="exp-amt">₦{exp.amount.toLocaleString()}</div>
              <div className="exp-date">{exp.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}