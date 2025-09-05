import React, { useState, useEffect } from "react";
import PurchaseList from "../components/lists/PurchaseList";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/purchases');
      
      // Format the data to match the frontend expectations
      const formattedData = data.map(purchase => ({
        ...purchase,
        paymentStatus: purchase.payment_status, // Map payment_status to paymentStatus
        supplier: purchase.Supplier ? purchase.Supplier.name : 'Unknown Supplier'
      }));
      
      setPurchases(formattedData);
      if (data.length === 0) {
        setError('No purchases found');  
      } else {
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch purchases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading purchases...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <PurchaseList 
          purchases={purchases || []} 
          onAddPurchase={() => navigate("/purchases/add")}
        />
      </div>
    </div>
  );
};

export default Purchases;