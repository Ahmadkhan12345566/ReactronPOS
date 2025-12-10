import React, { useState } from 'react';
import Accordion from '../components/forms/Accordion';
import PageHeader from '../components/forms/PageHeader';
import FormFooter from '../components/forms/FormFooter';
import { useNavigate } from 'react-router-dom';
import { usePos } from '../hooks/usePos';
import { api } from '../services/api';
import {
  ArrowPathIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

const AddUnit = () => {
  const { currentUser } = usePos();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      console.log('Data to send:', data);
      await api.post('/api/units', data);
      navigate('/units');
    } catch (error) {
      console.error('Error creating unit:', error);
    }
  };


  
  return (
    <div className="bg-gray-50 flex flex-col h-full p-6">
      <PageHeader 
        title="Create Unit"
        subtitle="Create new unit"
        backPath="/units"
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
            title="Unit Information"
            icon={InformationCircleIcon}
            isOpen={true}
            onToggle={() => {}}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Name <span className="text-red-500">*</span>
                </label>
                <input 
                  name="name"
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter unit name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Name <span className="text-red-500">*</span>
                </label>
                <input 
                  name="short_name"
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter short name"
                  required
                />
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </Accordion>

          
        </div>

        <FormFooter 
          cancelPath="/units" 
          submitLabel="Add Unit"
          disabled={currentUser.role !== 'admin'}
        />
      </form>
    </div>
  );
};

export default AddUnit;