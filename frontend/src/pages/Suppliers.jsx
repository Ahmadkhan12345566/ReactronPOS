import React, { useState, useEffect } from 'react';
import SupplierList from '../components/lists/SupplierList';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { usePos } from '../hooks/usePos';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/suppliers');
      
      setSuppliers(data);
      if (data.length === 0) {
        setError('No suppliers found');  
      } else {
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch suppliers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading suppliers...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <SupplierList 
        suppliers={suppliers || []} 
        setShowForm={() => navigate('/add-supplier')} 
      />
    </div>
  );
}