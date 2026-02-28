import React from 'react';

export default function ListPagination({ table, dataLength }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-xl p-4 shadow-sm border-2 border-gray-300">
      <div className="mb-4 md:mb-0">
        <span className="text-sm text-gray-700">
          Showing{' '}
          <span className="font-medium">
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-medium">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              dataLength
            )}
          </span>{' '}
          of <span className="font-medium">{dataLength}</span> results
        </span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-700">Rows per page:</span>
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>{pageSize}</option>
            ))}
          </select>
        </div>
        
        <div className="flex space-x-1">
          <button
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}