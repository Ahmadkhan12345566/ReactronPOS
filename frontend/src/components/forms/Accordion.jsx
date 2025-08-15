// components/Accordion.jsx
import React from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';

const Accordion = ({ 
  title, 
  isOpen, 
  onToggle, 
  children,
  icon: Icon 
}) => (
  <div className="border border-gray-800 rounded-lg mb-6">
    <button
      type="button"
      className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
      onClick={onToggle}
    >
      <div className="flex items-center">
        <Icon className="w-5 h-5 text-black mr-2" />
        <span className="font-medium">{title}</span>
      </div>
      <ChevronUpIcon
        className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`}
      />
    </button>
    
    {isOpen && (
      <div className="p-4 border-t border-gray-600">
        {children}
      </div>
    )}
  </div>
);

export default Accordion;