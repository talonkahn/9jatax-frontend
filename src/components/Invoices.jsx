import React, { useEffect, useState } from "react";
import api from "../api";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  // Load company invoices
  const loadInvoices = async () => {
    try {
      const { data } = await api.get("/invoices/company");
      setInvoices(data || []);
    } catch (err) {
      console.error("Failed to load invoices:", err.response?.data || err.message);
    }
  };

  const markAsPaid = async (id, total) => {
    setLoadingId(id);
    try {
      await api.post(`/invoices/${id}/pay`, { amount: total });

      // Update UI immediately
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === id ? { ...inv, status: "paid" } : inv
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to mark invoice as paid: " + (err.response?.data?.error || err.message));
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Invoices</h1>

      {invoices.length === 0 ? (
        <p>No invoices yet.</p>
      ) : (
        invoices.map((inv) => (
          <div
            key={inv.id}
            style={{
              border: "1px solid #333",
              padding: 12,
              marginBottom: 10,
            }}
          >
            <strong>{inv.invoice_number}</strong>
            <p>Customer: {inv.customer_name}</p>
            <p>Total: ₦{Number(inv.total).toLocaleString("en-NG")}</p>
            <p>Status: {inv.status}</p>

            {inv.status !== "paid" && (
              <button
                disabled={loadingId === inv.id}
                onClick={() => markAsPaid(inv.id, inv.total)}
                style={{
                  cursor: "pointer",
                  background: "#1db954",
                  color: "#000",
                }}
              >
                {loadingId === inv.id ? "Posting..." : "Mark as Paid"}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}