import React, { useState, useEffect } from 'react';
import InvoiceList from '../components/lists/InvoiceList';
import { api } from '../services/api';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/invoices');
      setInvoices(data);
    } catch (err) {
      setError('Failed to fetch invoices');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading invoices...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <InvoiceList invoices={invoices} />
    </div>
  );
}