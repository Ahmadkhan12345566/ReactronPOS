import React, { useState, useEffect } from 'react';
import Accordion from '../components/forms/Accordion';
import PageHeader from '../components/forms/PageHeader';
import FormFooter from '../components/forms/FormFooter';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  ArrowPathIcon,
  ChevronUpIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

const AddPurchase = () => {
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const data = await api.get('/api/suppliers');
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      // Convert numeric fields
      data.total = parseFloat(data.total) || 0;
      data.paid = parseFloat(data.paid) || 0;
      data.due = parseFloat(data.due) || 0;
      data.supplierId = parseInt(data.supplierId);
      
      // Set current date if not provided
      if (!data.date) {
        data.date = new Date().toISOString().split('T')[0];
      }
      
      console.log('Data to send:', data);
      await api.post('/api/purchases', data);
      navigate('/purchases');
    } catch (error) {
      console.error('Error creating purchase:', error);
    }
  };

  const calculateDueAmount = (e) => {
    const form = e.target.form;
    const total = parseFloat(form.total.value) || 0;
    const paid = parseFloat(form.paid.value) || 0;
    form.due.value = (total - paid).toFixed(2);
  };

  return (
    <div className="bg-gray-50 flex flex-col h-full p-6">
      <PageHeader 
        title="Create Purchase"
        subtitle="Create new purchase order"
        backPath="/purchases"
        actionButtons={
          <>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <ArrowPathIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <ChevronUpIcon className="w-5 h-5" />
            </button>
          </>
        }
      />

      <form className="bg-white rounded-xl shadow-sm p-6 flex flex-col min-h-0 h-full" onSubmit={handleSubmit}>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Accordion 
            title="Purchase Information"
            icon={InformationCircleIcon}
            isOpen={true}
            onToggle={() => {}}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference <span className="text-red-500">*</span>
                </label>
                <input 
                  name="reference"
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter reference number"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input 
                  name="date"
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier <span className="text-red-500">*</span>
                </label>
                <select 
                  name="supplierId" 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select 
                  name="status" 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Received">Received</option>
                  <option value="Pending">Pending</option>
                  <option value="Ordered">Ordered</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount <span className="text-red-500">*</span>
                </label>
                <input 
                  name="total"
                  type="number" 
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  required
                  onBlur={calculateDueAmount}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paid Amount <span className="text-red-500">*</span>
                </label>
                <input 
                  name="paid"
                  type="number" 
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  required
                  onBlur={calculateDueAmount}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Amount
                </label>
                <input 
                  name="due"
                  type="number" 
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                  placeholder="0.00"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status <span className="text-red-500">*</span>
                </label>
                <select 
                  name="payment_status" 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
          </Accordion>
        </div>

        <FormFooter 
          cancelPath="/purchases" 
          submitLabel="Add Purchase" 
        />
      </form>
    </div>
  );
};

export default AddPurchase;