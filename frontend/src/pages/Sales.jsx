import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SalesList from '../components/lists/SalesList';
import { api } from '../services/api';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/sales');
      setSales(data);
    } catch (err) {
      setError('Failed to fetch sales');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading sales...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <SalesList 
          sales={sales} 
          onRefresh={fetchSales}
          onAddItem={() => navigate('/add-sale')}
        />
      </div>
    </div>
  );
}