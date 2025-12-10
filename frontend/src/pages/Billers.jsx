import React, { useState, useEffect } from 'react';
import BillerList from '../components/lists/BillerList';
import { api } from '../services/api';
import { usePos } from '../hooks/usePos';

export default function Billers() {
  const [billers, setBillers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState('');

  const { currentUser } = usePos(); // Get current user from context

  useEffect(() => {
    if (currentUser) {
      setUserRole(currentUser.role || ''); // Set user role based on currentUser
      if (currentUser.role === 'admin') {
        fetchBillers(); // Fetch billers only if the user is an admin
      }
    }
  }, [currentUser]); // Dependency array ensures effect runs when currentUser changes

  const fetchBillers = async () => {
    try {
      const billersData = await api.get('/api/billers');
      setBillers(billersData);
    } catch (error) {
      console.error('Failed to fetch billers:', error);
    }
  };

  // Show unauthorized message for billers
  if (userRole === 'biller') {
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
      <BillerList Billers={billers} setShowForm={setShowForm} />
    </div>
  );
}
