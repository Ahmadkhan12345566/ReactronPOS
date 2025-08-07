import React, { useState, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function BillerList({ Billers, setShowForm }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [rowSelection, setRowSelection] = useState({});
  
  // Status options
  const statusOptions = useMemo(() => ['All', 'Active', 'Inactive'], []);

  // Export to Excel function
  const exportToExcel = () => {
    const data = filteredData.map((Biller, index) => ({
      '#': index + 1,
      Code: Biller.code,
      Biller: Biller.name,
      Email: Biller.email,
      Phone: Biller.phone,
      company: Biller.company,
      Status: Biller.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Billers");
    XLSX.writeFile(workbook, `Billers_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // Export to PDF function
  const exportToPDF = () => {
    const doc = new jsPDF();
    const headers = [['#', 'Code', 'Biller', 'Email', 'Phone', 'company', 'Status']];
    const data = filteredData.map((Biller, index) => [
      index + 1,
      Biller.code,
      Biller.name,
      Biller.email,
      Biller.phone,
      Biller.company,
      Biller.status
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 23, 42] }
    });

    doc.save(`Billers_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  // Columns configuration
  const columns = [
    {
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
      size: 40,
    },
    {
      accessorKey: 'code',
      header: 'Code',
      size: 100,
    },
    {
      accessorKey: 'name',
      header: 'Biller',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="bg-gray-100 rounded-full p-1 mr-3">
            <img 
              src={row.original.avatar} 
              alt={row.original.name} 
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
          <span>{row.original.name}</span>
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      size: 200,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      size: 120,
    },
    {
      accessorKey: 'company',
      header: 'company',
      size: 120,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          getValue() === 'Active' 
            ? 'text-success bg-success-transparent' 
            : 'text-danger bg-danger-transparent'
        }`}>
          <i className="ti ti-point-filled me-1 fs-11"></i>
          {getValue()}
        </span>
      ),
      size: 100,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex space-x-1">
          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      ),
      size: 120,
    },
  ];

  // Filtered data
  const filteredData = useMemo(() => {
    return Billers.filter(Biller => 
      (statusFilter === 'All' || Biller.status === statusFilter) &&
      `${Biller.name} ${Biller.email} ${Biller.phone} ${Biller.company}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [Billers, search, statusFilter]);

  // Table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Billers</h1>
            <p className="text-gray-600">Manage your Billers</p>
          </div>

          <div className='flex gap-1'>
            {/* Control buttons */}
            <div className="flex items-center space-x-2">
              <button onClick={exportToPDF} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <img src="/src/assets/icons/pdf.svg" alt="pdf" className="w-5 h-5" />
                </button>
                <button onClick={exportToExcel} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <img src="/src/assets/icons/excel.svg" alt="excel" className="w-5 h-5" />
                </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 4v6h-6M1 20v-6h6"></path>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <i className="ti ti-chevron-up"></i>
              </button>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Biller
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center w-full md:w-auto">
            <div className="relative w-full">
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search Billers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full md:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th 
                      key={header.id} 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
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
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">No Billers found</div>
            <button 
              className="mt-2 text-blue-600 hover:text-blue-800"
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-xl p-4 shadow-sm">
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
                filteredData.length
              )}
            </span>{' '}
            of <span className="font-medium">{filteredData.length}</span> results
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-700">Rows per page:</span>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
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
    </div>
  );
}