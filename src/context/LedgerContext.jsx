import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api"; // Use your axios instance

const LedgerContext = createContext();
export const useLedger = () => useContext(LedgerContext);

export function LedgerProvider({ companyId, children }) {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem("9jatax_token"); // unified token key

  const fetchLedger = async () => {
    if (!companyId) {
      setLedger([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.get(`/ledger/company/${companyId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

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
      await api.post(`/ledger/${entryId}/post`, {}, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      await fetchLedger();
    } catch (err) {
      console.error("Post entry failed:", err);
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