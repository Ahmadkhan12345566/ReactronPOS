// Products.jsx
import React, { useState, useEffect } from 'react';
import ProductList from '../components/lists/ProductList';
import { NavLink } from 'react-router-dom';
import ImportProduct from "../components/ImportProduct";
import { api } from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/products');
      setProducts(data);
      if (data.length === 0) {
        setError('No products found');  
      } else {
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading products...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 h-full flex flex-col">
      
      <div className="flex-1 min-h-0">
        <ProductList 
          products={products || []} 
          setShowForm={setShowForm} 
          onProductUpdate={fetchProducts}
        />
      </div>
      {showForm && <ImportProduct showForm={showForm} setShowForm={setShowForm} onImportComplete={fetchProducts}/>}
    </div>
  );
}