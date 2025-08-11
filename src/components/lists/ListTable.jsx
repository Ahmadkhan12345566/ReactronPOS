import React from 'react';
import { flexRender } from '@tanstack/react-table';

export default function ListTable({ table, isLoading, emptyState, maxHeight }) {
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-gray-300">
      <div className={`overflow-x-auto flex-grow ${maxHeight}`}>
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50 sticky top-0">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: header.getSize() }}
                  >
                    {!header.isPlaceholder && flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-300">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td 
                    key={cell.id} 
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      cell.column.columnDef.meta?.align === 'center' ? 'text-center' : ''
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {table.getRowModel().rows.length === 0 && emptyState}
    </div>
  );
}