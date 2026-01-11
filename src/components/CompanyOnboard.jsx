import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./CompanyOnboard.css";

export default function CompanyOnboard() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [company, setCompany] = useState({
    name: "",
    tin: "",
    rc: "",
    industry: "",
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
    if (!company.name || !company.rc || !company.tin) {
      alert("Please fill Company Name, RC, and TIN.");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("9jatax_token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      /* =====================
         1️⃣ CREATE COMPANY (ONLY BLOCKER)
      ===================== */
      const { data } = await api.post(
        "/companies",
        {
          name: company.name,
          rc: company.rc,
          tin: company.tin,
          industry: company.industry,
          vat_registered: company.vatRegistered,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      if (!data?.id) {
        throw new Error("Company creation returned no ID");
      }

      // ✅ CRITICAL: persist company
      localStorage.setItem("company_id", data.id);

      /* =====================
         2️⃣ OPTIONAL: SAVE TAX (NON-BLOCKING)
      ===================== */
      api.post(
        "/company-tax",
        {
          company_id: data.id,
          vat_enabled: company.vatRegistered,
          paye_enabled: company.paye,
          withholding_enabled: company.withholdingTax,
          stamp_duty_enabled: company.stampDuty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).catch(() => {
        // intentionally ignored
      });

      /* =====================
         3️⃣ ENTER DASHBOARD — NO CONDITIONS
      ===================== */
      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error("COMPANY ONBOARD ERROR:", err);
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
        <input
          name="rc"
          placeholder="RC Number"
          value={company.rc}
          onChange={handleChange}
        />
        <input
          name="tin"
          placeholder="TIN"
          value={company.tin}
          onChange={handleChange}
        />

        <select
          name="industry"
          value={company.industry}
          onChange={handleChange}
        >
          <option value="">Select Industry</option>
          <option value="Logistics">Logistics</option>
          <option value="Retail">Retail</option>
          <option value="Services">Services</option>
          <option value="Technology">Technology</option>
        </select>
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