import React from 'react';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
// Define status configurations
const statusMap = {
  Received: { className: 'bg-green-100 text-green-800' },
  Pending: { className: 'bg-cyan-100 text-cyan-800' },
  Ordered: { className: 'bg-yellow-100 text-yellow-800' },
  default: { className: 'bg-gray-100 text-gray-800' }
};

const paymentStatusConfig = {
  Paid: { className: 'bg-green-100 text-green-800' },
  Unpaid: { className: 'bg-red-100 text-red-800' },
  Overdue: { className: 'bg-yellow-100 text-yellow-800' },
  default: { className: 'bg-gray-100 text-gray-800' }
}
// Reusable Select Column
export const selectColumn = (size = 40) => ({
  id: 'select',
  header: ({ table }) => (
    <input
      type="checkbox"
      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
      checked={table.getIsAllRowsSelected()}
      onChange={table.getToggleAllRowsSelectedHandler()}
    />
  ),
  cell: ({ row }) => (
    <input
      type="checkbox"
      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
      checked={row.getIsSelected()}
      onChange={row.getToggleSelectedHandler()}
    />
  ),
  size
});

// Reusable Index Column
export const indexColumn = (size = 50) => ({
  id: 'index',
  header: '#',
  cell: ({ row, table }) => {
    const page = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;
    return (
      <span className="text-gray-500">
        {page * pageSize + row.index + 1}
      </span>
    );
  },
  size,
  meta: { align: 'center' }
});

// Reusable Status Column
export const statusColumn = (accessor, header, size = 100) => ({
  accessorKey: accessor,
  header,
  cell: ({ getValue }) => {
    const value = getValue();
    const statusConfig = statusMap[value] || paymentStatusConfig[value] || statusMap.default;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
        {value}
      </span>
    );
  },
  size
});

// Reusable Actions Column
export const actionsColumn = (actions = ['view', 'edit', 'delete'], size = 120) => ({
  id: 'actions',
  header: '',
  cell: ({ row }) => (
    <div className="flex justify-center">
      <div className="dropdown">
        <button className="text-gray-500 hover:text-gray-700">
          {/* Three dots icon */}
        </button>
        <div className="dropdown-menu">
         
          <div className="flex space-x-1 mb-2">
            {actions.includes('view') && (
              <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                <EyeIcon className="w-5 h-5" />
              </button>
            )}
            {actions.includes('edit') && (
              <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg">
                <PencilIcon className="w-5 h-5" />
              </button>
            )}
            {actions.includes('delete') && (
              <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  ),
  size
});

// Reusable Image Column
export const imageColumn = (accessor, header, imageAccessor, size = 200) => ({
  accessorKey: accessor,
  header,
  cell: ({ row }) => (
    <div className="flex items-center">
      <div className="bg-gray-100 rounded-full p-1 mr-3">
        <img 
          src={row.original[imageAccessor]} 
          alt={row.original[accessor]} 
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>
      <span>{row.original[accessor]}</span>
    </div>
  ),
  size
});