import React, { useState } from "react";
import {
  FaLock,
  FaChevronDown,
  FaChevronRight,
  FaPlus,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import "./ChartOfAccounts.css";

export default function ChartOfAccounts() {
  const [open, setOpen] = useState({
    assets: true,
    liabilities: false,
    equity: false,
    revenue: false,
    expenses: false,
  });

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const toggle = (key) => {
    setOpen({ ...open, [key]: !open[key] });
  };

  const accounts = {
    assets: [
      { code: 1000, name: "Cash", desc: "Cash & bank balances" },
      { code: 1100, name: "Accounts Receivable", desc: "Customer debts" },
      { code: 1500, name: "Equipment", desc: "Long-term assets", premium: true },
    ],
    liabilities: [
      { code: 2000, name: "Accounts Payable", desc: "Supplier debts" },
      { code: 2100, name: "Loans Payable", desc: "Loan obligations" },
    ],
    equity: [
      { code: 3000, name: "Owner's Capital", desc: "Owner investments" },
      { code: 3100, name: "Retained Earnings", desc: "Accumulated profits" },
    ],
    revenue: [
      { code: 4000, name: "Sales Revenue", desc: "Sales income" },
      { code: 4100, name: "Interest Income", desc: "Interest earned" },
    ],
    expenses: [
      { code: 5000, name: "Rent Expense", desc: "Office rent" },
      { code: 5200, name: "Fuel Expense", desc: "Fuel & transport" },
      { code: 5400, name: "Salaries & Wages", desc: "Employee wages", premium: true },
    ],
  };

  // Filter all accounts based on search
  const matchesSearch = (acc) => {
    const s = search.toLowerCase();
    return (
      acc.name.toLowerCase().includes(s) ||
      acc.desc.toLowerCase().includes(s) ||
      String(acc.code).includes(s)
    );
  };

  return (
    <div className="coa-container">
      <h1>Chart of Accounts</h1>
      <p className="coa-description">
        Your complete financial account list for organizing transactions.
      </p>

      {/* SEARCH BAR */}
      <div className="coa-search-box">
        <FaSearch className="coa-search-icon" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search accounts by name, code, or description..."
        />
      </div>

      {/* ACCOUNT CATEGORIES */}
      {Object.entries(accounts).map(([category, list]) => {
        const filtered = list.filter((acc) => matchesSearch(acc));
        const label = category.charAt(0).toUpperCase() + category.slice(1);

        return (
          <div
            className={`coa-category ${
              open[category] ? "coa-category-open" : ""
            }`}
            key={category}
          >
            <button className="coa-toggle" onClick={() => toggle(category)}>
              <span>{label}</span>
              {open[category] ? (
                <FaChevronDown className="coa-icon" />
              ) : (
                <FaChevronRight className="coa-icon" />
              )}
            </button>

            {open[category] && (
              <div className="coa-list">
                {filtered.length === 0 && (
                  <div className="coa-empty">No matching accounts.</div>
                )}

                {filtered.map((acc) => (
                  <div
                    key={acc.code}
                    className={`coa-item ${acc.premium ? "coa-premium" : ""}`}
                  >
                    <div className="coa-info">
                      <div className="coa-code-name">
                        {acc.code} — {acc.name}
                      </div>
                      <div className="coa-desc">{acc.desc}</div>
                    </div>

                    {acc.premium && (
                      <div className="coa-premium-badge" title="Premium Feature">
                        <FaLock className="coa-lock" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

})}

      {/* CREATE BUTTON */}
      <button
        className="coa-create-btn"
        onClick={() => setShowModal(true)}
      >
        <FaPlus /> Create New Account
      </button>

      {/* MODAL */}
      {showModal && (
        <div className="coa-modal-overlay">
          <div className="coa-modal">
            <div className="coa-modal-header">
              <h3>Create New Account</h3>
              <FaTimes
                className="coa-close"
                onClick={() => setShowModal(false)}
              />
            </div>

            <p className="coa-modal-warning">
              Creating new accounts is a premium feature.
            </p>

            <button className="coa-upgrade-btn">
              <FaLock /> Upgrade to Unlock
            </button>
          </div>
        </div>
      )}
    </div>
  );
}