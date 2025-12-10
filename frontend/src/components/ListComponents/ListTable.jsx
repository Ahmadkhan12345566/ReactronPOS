import React, { useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import ActionModal from './ActionModal';

export default function ListTable({ table, isLoading, emptyState, maxHeight, handleDelete, handleEdit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalData, setModalData] = useState(null);

  const openModal = (action, data) => {
    setModalAction(action);
    setModalData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalAction(null);
    setModalData(null);
  };

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <>
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
                      {flexRender(cell.column.columnDef.cell, { ...cell.getContext(), openModal })}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {table.getRowModel().rows.length === 0 && emptyState}
      </div>
      <ActionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        action={modalAction}
        data={modalData}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    </>
  );
}