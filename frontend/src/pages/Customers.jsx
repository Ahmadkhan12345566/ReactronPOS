import React, { useState, useEffect } from 'react';
import CustomerList from '../components/lists/CustomerList';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/customers');
      
      setCustomers(data);
      if (data.length === 0) {
        setError('No customers found');  
      } else {
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading customers...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <CustomerList 
        customers={customers || []} 
        setShowForm={() => navigate('/customers/add')} 
      />
    </div>
  );
}