import React, { useState, useEffect } from 'react';
import BillerList from '../components/lists/BillerList';
import { api } from '../services/api';
import { usePos } from '../hooks/usePos';

export default function Billers() {
  const [billers, setBillers] = useState([]);
  const [, setShowForm] = useState(false);
  const { currentUser } = usePos();
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchBillers();
    }
  }, [isAdmin]);

  const fetchBillers = async () => {
    try {
      const billersData = await api.get('/api/billers');
      setBillers(billersData);
    } catch (error) {
      console.error('Failed to fetch billers:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h2>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <BillerList billers={billers} setShowForm={setShowForm} onRefresh={fetchBillers} />
    </div>
  );
}
