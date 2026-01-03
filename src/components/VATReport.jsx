import React, { useEffect, useState } from "react";
import api from "../api";
import "./VATReport.css";

export default function VATReport() {
  const [vatData, setVatData] = useState([]);
  const [company, setCompany] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVAT = async () => {
    setLoading(true);
    setError("");
    try {
      // Backend now returns { company, vat }
      const { data } = await api.get("/reports/vat");
      setCompany(data.company || {});
      setVatData(data.vat || []);
    } catch (err) {
      console.error("VAT fetch error:", err.response?.data || err.message);
      setError("Failed to fetch VAT data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVAT();
  }, []);

  const downloadFile = async (type) => {
    if (!company.id) {
      alert("Company information not found. Cannot export VAT report.");
      return;
    }

    const filename = type === "csv" ? "VAT_Report.csv" : "VAT_Report.pdf";
    const url = `/exports/vat/${type}/${company.id}`;

    try {
      const res = await api.get(url, { responseType: "blob" });
      const blob = new Blob([res.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed:", err.response?.data || err.message);
      alert("Export failed");
    }
  };

  if (loading) return <h1 className="vat-title">Loading VAT Report...</h1>;
  if (error) return <div className="vat-error">{error}</div>;

  const totalVAT = vatData.reduce((acc, row) => acc + Number(row.vat_amount || 0), 0);

  return (
    <div className="vat-container">
      <h1 className="vat-title">VAT Report</h1>

      {/* COMPANY INFO BLOCK */}
      {company.name && (
        <div className="vat-company-info">
          <p><strong>Company:</strong> {company.name}</p>
          <p><strong>TIN:</strong> {company.tin || "N/A"}</p>
          <p><strong>RC:</strong> {company.rc || "N/A"}</p>
          <p><strong>Industry:</strong> {company.industry || "N/A"}</p>
          <p><strong>VAT Registered:</strong> {company.vat_registered ? "Yes" : "No"}</p>
        </div>
      )}

      <p className="vat-sub">Monthly VAT collected summary.</p>

      {/* EXPORT BUTTONS */}
      <div className="vat-actions">
        <button className="vat-export-btn" onClick={() => downloadFile("csv")}>
          Export CSV
        </button>
        <button className="vat-export-btn" onClick={() => downloadFile("pdf")}>
          Export PDF
        </button>
      </div>

      {/* VAT TABLE */}
      {vatData.length === 0 ? (
        <p className="vat-no-data">No VAT data yet.</p>
      ) : (
        <div className="vat-table">
          <div className="vat-head">
            <div>Month</div>
            <div>VAT Collected (₦)</div>
          </div>

          {vatData.map((row, idx) => (
            <div className="vat-row" key={idx}>
              <div>
                {new Date(row.month).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div>
                ₦
                {Number(row.vat_amount || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TOTAL */}
      <div className="vat-total">
        Total VAT: ₦
        {totalVAT.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    </div>
  );
}