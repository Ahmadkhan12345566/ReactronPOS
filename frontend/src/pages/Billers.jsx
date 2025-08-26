import React, { useState, useEffect } from 'react';
import BillerList from '../components/lists/BillerList';
import { api } from '../services/api';

export default function Billers() {
  const [billers, setBillers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchBillers();
  }, []);

  const fetchBillers = async () => {
    try {
      const billersData = await api.get('/users?role=biller');
      setBillers(billersData);
    } catch (error) {
      console.error('Failed to fetch billers:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <BillerList Billers={billers} setShowForm={setShowForm} />
    </div>
  );
}