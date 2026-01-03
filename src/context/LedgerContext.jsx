import React, { createContext, useContext, useEffect, useState } from "react";

const LedgerContext = createContext();
export const useLedger = () => useContext(LedgerContext);

export function LedgerProvider({ companyId, children }) {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem("token"); // JWT stored at login

  const fetchLedger = async () => {
    if (!companyId) {
      setLedger([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`http://localhost:4000/api/ledger/company/${companyId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`, // Include token
        },
      });

      if (!res.ok) {
        throw new Error(`Ledger fetch failed: ${res.statusText}`);
      }

      const data = await res.json();
      setLedger(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Ledger fetch failed:", err);
      setLedger([]);
    } finally {
      setLoading(false);
    }
  };

  const postEntry = async (entryId) => {
    if (!companyId || !entryId) return;

    try {
      const res = await fetch(`http://localhost:4000/api/ledger/${entryId}/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Post entry failed: ${res.statusText}`);
      }

      await fetchLedger();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, [companyId]);

  const postedEntries = ledger.filter((e) => e.status === "posted");

  return (
    <LedgerContext.Provider
      value={{
        ledger,
        postedEntries,
        loading,
        refreshLedger: fetchLedger,
        postEntry,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
}