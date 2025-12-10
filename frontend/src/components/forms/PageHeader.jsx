// components/PageHeader.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const PageHeader = ({ 
  title, 
  subtitle, 
  backPath,
  actionButtons 
}) => (
  <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
    <div>
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
    
    <div className="flex items-center space-x-3">
      {actionButtons}
      <NavLink 
        to={backPath} 
        className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back to {backPath.split('/')[1]}
      </NavLink>
    </div>
  </div>
);

export default PageHeader;