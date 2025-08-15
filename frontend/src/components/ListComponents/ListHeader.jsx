import React from 'react';

export default function ListHeader({ title, description, controlButtons, primaryButtons, extraElement }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-gray-300">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
        
        <div className='flex gap-1'>
          {controlButtons && (
            <div className="flex items-center space-x-2">
              {controlButtons}
            </div>
          )}
          
          {primaryButtons && (
            <div className="flex space-x-3">
              {primaryButtons}
            </div>
          )}
          
          {extraElement}
        </div>
      </div>
    </div>
  );
}