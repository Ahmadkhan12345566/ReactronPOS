import React, { useState, useEffect } from 'react';
import CategoryList from '../components/lists/CategoryList';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/categories');
      
      // Format dates for display
      const formattedData = data.map(category => ({
        ...category,
        created_at: new Date(category.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }));
      
      setCategories(formattedData);
      if (data.length === 0) {
        setError('No categories found');  
      } else {
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading categories...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <CategoryList 
        categories={categories || []} 
        setShowForm={() => navigate('/categories/add')} 
      />
    </div>
  );
}