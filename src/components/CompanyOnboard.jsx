import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./CompanyOnboard.css";

export default function CompanyOnboard() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [company, setCompany] = useState({
    name: "",
    vatRegistered: false,
    paye: false,
    withholdingTax: false,
    stampDuty: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCompany((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!company.name) {
      alert("Please enter a company name.");
      return;
    }

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("User not authenticated. Please log in again.");
      return;
    }

    setSaving(true);

    try {
      /* =====================
         1️⃣ CREATE COMPANY
      ===================== */
      const companyRes = await api.post("/companies", {
        user_id: userId,
        name: company.name,
      });

      if (!companyRes.data?.id) {
        throw new Error("Company creation failed");
      }

      /* =====================
         2️⃣ SAVE TAX SETTINGS
      ===================== */
      await api.post("/company-tax", {
        company_id: companyRes.data.id,
        vat_enabled: company.vatRegistered,
        paye_enabled: company.paye,
        withholding_enabled: company.withholdingTax,
        stamp_duty_enabled: company.stampDuty,
      });

      /* =====================
         3️⃣ REFRESH TOKEN
      ===================== */
      const refreshRes = await api.post("/auth/refresh", null, {
        headers: {
          Authorization: Bearer ${localStorage.getItem("9jatax_token")},
        },
      });

      localStorage.setItem("9jatax_token", refreshRes.data.token);

      /* =====================
         4️⃣ GO TO DASHBOARD
      ===================== */
      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error(
        "COMPANY ONBOARD ERROR:",
        err.response?.data || err.message
      );
      alert(err.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="company-container">
      <h1>Company Setup</h1>

      <div className="company-card">
        <h2>Company Information</h2>
        <input
          name="name"
          placeholder="Company Name"
          value={company.name}
          onChange={handleChange}
        />
      </div>

      <div className="company-card">
        <h2>Tax Settings</h2>

        <label>
          <input
            type="checkbox"
            name="vatRegistered"
            checked={company.vatRegistered}
            onChange={handleChange}
          />
          VAT Registered
        </label>

        <label>
          <input
            type="checkbox"
            name="paye"
            checked={company.paye}
            onChange={handleChange}
          />
          PAYE
        </label>

        <label>
          <input
            type="checkbox"
            name="withholdingTax"
            checked={company.withholdingTax}
            onChange={handleChange}
          />
          Withholding Tax
        </label>

        <label>
          <input
            type="checkbox"
            name="stampDuty"
            checked={company.stampDuty}
            onChange={handleChange}
          />
          Stamp Duty
        </label>
      </div>

      <button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Company"}
      </button>
    </div>
  );
}