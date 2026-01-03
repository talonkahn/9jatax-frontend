import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import ChartOfAccounts from "./components/ChartOfAccounts";
import InvoiceBuilder from "./components/InvoiceBuilder";
import Invoices from "./components/Invoices";
import TransactionEntry from "./components/TransactionEntry";
import Expenses from "./components/Expenses";
import Ledger from "./components/Ledger";
import IncomeStatement from "./components/IncomeStatement";
import BalanceSheet from "./components/BalanceSheet";
import VATReport from "./components/VATReport";

import Settings from "./components/Settings";
import CompanyOnboard from "./components/CompanyOnboard";
import Users from "./components/Users";
import Preferences from "./components/Preferences";

import { LedgerProvider } from "./context/LedgerContext";

export default function App() {
  const [companyId, setCompanyId] = useState(
    localStorage.getItem("company_id")
  );

  useEffect(() => {
    const syncCompany = () => {
      setCompanyId(localStorage.getItem("company_id"));
    };

    window.addEventListener("storage", syncCompany);
    return () => window.removeEventListener("storage", syncCompany);
  }, []);

  return (
    <LedgerProvider companyId={companyId}>
      <div className="app">
        <header className="topbar">
          <div className="brand">9jaTax</div>
          <nav>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/accounts">Accounts</Link>
            <Link to="/invoices/new">Create Invoice</Link>
            <Link to="/balance-sheet">Balance</Link>
            <Link to="/vat">VAT</Link>
            <Link to="/settings">Settings</Link>
          </nav>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Auth />} />

            {/* HARD GATE: no company = no dashboard */}
            <Route
              path="/dashboard"
              element={
                companyId
                  ? <Dashboard />
                  : <Navigate to="/settings/company" replace />
              }
            />

            <Route path="/accounts" element={<ChartOfAccounts />} />
            <Route path="/invoices" element={<Invoices companyId={companyId} />} />
            <Route path="/invoices/new" element={<InvoiceBuilder companyId={companyId} />} />
            <Route path="/transactions" element={<TransactionEntry />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/ledger" element={<Ledger companyId={companyId} />} />
            <Route path="/income-statement" element={<IncomeStatement companyId={companyId} />} />
            <Route path="/balance-sheet" element={<BalanceSheet companyId={companyId} />} />
            <Route path="/vat" element={<VATReport companyId={companyId} />} />

            {/* SETTINGS */}
            <Route path="/settings" element={<Settings />}>
              <Route path="company" element={<CompanyOnboard />} />
              <Route path="users" element={<Users />} />
              <Route path="preferences" element={<Preferences />} />
            </Route>
          </Routes>
        </main>

        <footer className="footer">
          © {new Date().getFullYear()} 9jaTax — Bookkeeping built by HSPRAFIQUE for Naija.
        </footer>
      </div>
    </LedgerProvider>
  );
}