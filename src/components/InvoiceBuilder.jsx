import React, { useState, useMemo } from "react";
import "./Invoice.css";

export default function InvoiceBuilder() {
  const [customer, setCustomer] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState([{ description: "", qty: 1, price: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showLedgerPreview, setShowLedgerPreview] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const VAT_RATE = 0.075;

  const token = localStorage.getItem("9jatax_token");
  const companyId = localStorage.getItem("company_id");

  const invoiceNumber = useMemo(
    () => `INV-${Date.now().toString().slice(-6)}`,
    []
  );

  const addItem = () => setItems([...items, { description: "", qty: 1, price: 0 }]);

  const updateItem = (i, key, value) => {
    const copy = [...items];
    copy[i][key] = value;
    setItems(copy);
  };

  const subtotal = items.reduce((sum, it) => sum + it.qty * it.price, 0);
  const vatAmount = subtotal * VAT_RATE;
  const totalAmount = subtotal + vatAmount - discount;

  const saveInvoice = async () => {
    if (!token) return alert("Authentication token missing");
    if (!companyId) return alert("Company not selected");
    if (!customer.trim()) return alert("Customer name required");
    if (items.length === 0) return alert("Invoice must have items");

    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/api/invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company_id: companyId,
          customer_name: customer,
          invoice_number: invoiceNumber,
          date,
          subtotal,
          vat: vatAmount,
          total: totalAmount,
          payload: { items },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Invoice save failed");
      }

      await res.json();
      alert("Invoice saved successfully");

      setCustomer("");
      setItems([{ description: "", qty: 1, price: 0 }]);
      setDiscount(0);
      setShowLedgerPreview(false);

    } catch (err) {
      console.error("INVOICE SAVE ERROR:", err);
      alert("Failed to save invoice: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Premium button style
  const buttonStyle = {
    background: "linear-gradient(135deg, #4f46e5, #6366f1)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  };

  const buttonHoverStyle = {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
  };

  return (
    <div className="invoice-container">
      <h1>Create Invoice</h1>

      <div className="invoice-header">
        <div>
          <label>Customer</label>
          <input
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Customer name"
          />
        </div>

        <div>
          <label>Invoice #</label>
          <input value={invoiceNumber} disabled />

          <label className="inv-preview-toggle">
            <input
              type="checkbox"
              checked={showLedgerPreview}
              onChange={() => setShowLedgerPreview(!showLedgerPreview)}
            />
            Preview Ledger
          </label>
        </div>

        <div>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="invoice-table">
        <div className="invoice-table-header">
          <span>Description</span>
          <span>Qty</span>
          <span>Price</span>
          <span>Total</span>
</div>

        {items.map((it, i) => (
          <div className="invoice-row" key={i}>
            <input
              value={it.description}
              onChange={(e) => updateItem(i, "description", e.target.value)}
            />
            <input
              type="number"
              min="1"
              value={it.qty}
              onChange={(e) => updateItem(i, "qty", Number(e.target.value))}
            />
            <input
              type="number"
              min="0"
              value={it.price}
              onChange={(e) => updateItem(i, "price", Number(e.target.value))}
            />
            <span>₦{(it.qty * it.price).toLocaleString("en-NG")}</span>
          </div>
        ))}

        <button
          style={buttonStyle}
          onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
          onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
          onClick={addItem}
        >
          + Add Item
        </button>
      </div>

      <div className="invoice-summary">
        <p>Subtotal: ₦{subtotal.toLocaleString("en-NG")}</p>
        <p>VAT (7.5%): ₦{vatAmount.toLocaleString("en-NG")}</p>
        <h2>Total: ₦{totalAmount.toLocaleString("en-NG")}</h2>
      </div>

      {showLedgerPreview && totalAmount > 0 && (
        <div className="ledger-preview">
          <h3>Ledger Preview</h3>
          <div className="debit">
            Debit AR (1100): ₦{totalAmount.toLocaleString("en-NG")}
          </div>
          <div className="credit">
            Credit Revenue (4000): ₦{subtotal.toLocaleString("en-NG")}
          </div>
          <div className="credit">
            Credit VAT (2100): ₦{vatAmount.toLocaleString("en-NG")}
          </div>
        </div>
      )}

      <button
        style={buttonStyle}
        onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
        onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
        onClick={saveInvoice}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Invoice"}
      </button>
    </div>
  );
}