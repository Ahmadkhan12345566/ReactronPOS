import React, { useState, useEffect } from 'react';
import BrandList from '../components/lists/BrandList';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/brands');
      
      // Format dates for display
      const formattedData = data.map(brand => ({
        ...brand,
        createdAt: new Date(brand.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }));
      
      setBrands(formattedData);
      if (data.length === 0) {
        setError('No brands found');  
      } else {
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch brands');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading brands...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <BrandList 
        brands={brands || []} 
        setShowForm={() => navigate('/brands/add')} 
      />
    </div>
  );
}