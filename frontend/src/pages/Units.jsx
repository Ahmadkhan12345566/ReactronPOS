import React, { useState, useEffect } from 'react';
import UnitList from '../components/lists/UnitList';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Units() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/units');
      
      // Format dates for display
      const formattedData = data.map(unit => ({
        ...unit,
        createdAt: new Date(unit.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }));
      
      setUnits(formattedData);
      if (data.length === 0) {
        setError('No units found');  
      } else {
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch units');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading units...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <UnitList 
        units={units || []} 
        setShowForm={() => navigate('/units/add')} 
      />
    </div>
  );
}