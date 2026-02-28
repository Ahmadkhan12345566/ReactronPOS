import React from 'react';

export default function ListFilter({ children }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-gray-300">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <form className="flex items-center" onSubmit={e => e.preventDefault()}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              {children}
            </div>
          </form>   
        </div>
    </div>
  );
}