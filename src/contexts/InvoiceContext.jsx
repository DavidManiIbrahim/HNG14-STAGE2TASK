import React, { createContext, useContext, useState, useEffect } from 'react';

const InvoiceContext = createContext();

const initialInvoices = [];

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('invoices');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialInvoices;
      }
    }
    return initialInvoices;
  });

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const addInvoice = (invoice) => {
    setInvoices(prev => [...prev, { ...invoice, id: generateId() }]);
  };

  const updateInvoice = (id, updatedInvoice) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...updatedInvoice, id } : inv));
  };

  const deleteInvoice = (id) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const markAsPaid = (id) => {
    setInvoices(prev => prev.map(inv => inv.id === id && inv.status !== 'Draft' ? { ...inv, status: 'Paid' } : inv));
  };

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, updateInvoice, deleteInvoice, markAsPaid }}>
      {children}
    </InvoiceContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useInvoice = () => useContext(InvoiceContext);

// Utility to generate a random ID (e.g., RT3080)
const generateId = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetters = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
  const randomNumbers = Math.floor(1000 + Math.random() * 9000);
  return `${randomLetters}${randomNumbers}`;
};
