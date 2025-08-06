import React, { useState, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import LoopIcon from '@mui/icons-material/Loop';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function SaleList({ sales, setShowForm }) {
  const [search, setSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [rowSelection, setRowSelection] = useState({});
  
  // Customer options
  const customerOptions = useMemo(() => {
    const customers = [...new Set(sales.map(sale => sale.customer.name))];
    return ['All', ...customers];
  }, [sales]);
  
  // Status options
  const statusOptions = useMemo(() => ['All', 'Completed', 'Pending'], []);
  
  // Payment status options
  const paymentStatusOptions = useMemo(() => ['All', 'Paid', 'Unpaid', 'Overdue'], []);

  // Export to Excel function
  const exportToExcel = () => {
    const data = filteredData.map((sale, index) => ({
      '#': index + 1,
      Customer: sale.customer.name,
      Reference: sale.reference,
      Date: sale.date,
      Status: sale.status,
      'Grand Total': `$${sale.grandTotal}`,
      Paid: `$${sale.paid}`,
      Due: `$${sale.due}`,
      'Payment Status': sale.paymentStatus,
      Biller: sale.biller
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");
    XLSX.writeFile(workbook, `sales_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // Export to PDF function
  const exportToPDF = () => {
    const doc = new jsPDF();
    const headers = [['#', 'Customer', 'Reference', 'Date', 'Status', 'Grand Total', 'Paid', 'Due', 'Payment Status', 'Biller']];
    const data = filteredData.map((sale, index) => [
      index + 1,
      sale.customer.name,
      sale.reference,
      sale.date,
      sale.status,
      `$${sale.grandTotal}`,
      `$${sale.paid}`,
      `$${sale.due}`,
      sale.paymentStatus,
      sale.biller
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 23, 42] }
    });

    doc.save(`sales_${new Date().toISOString().slice(0,10)}.pdf`);
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
      id: 'index',
      header: '#',
      cell: ({ row, table }) => {
        const page = table.getState().pagination.pageIndex;
        const size = table.getState().pagination.pageSize;
        return (
          <span className="text-gray-500">
            {page * size + row.index + 1}
          </span>
        );
      },
      size: 50,
      meta: { align: 'center' }
    },
    {
      accessorKey: 'customer',
      header: 'Customer',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="bg-gray-100 rounded-full p-1 mr-3">
            <img 
              src={row.original.customer.avatar} 
              alt={row.original.customer.name} 
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
          <span>{row.original.customer.name}</span>
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: 'reference',
      header: 'Reference',
      size: 100,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      size: 120,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          getValue() === 'Completed' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-cyan-100 text-cyan-800'
        }`}>
          {getValue()}
        </span>
      ),
      size: 100,
    },
    {
      accessorKey: 'grandTotal',
      header: 'Grand Total',
      cell: ({ getValue }) => <span>${getValue()}</span>,
      size: 100,
    },
    {
      accessorKey: 'paid',
      header: 'Paid',
      cell: ({ getValue }) => <span>${getValue()}</span>,
      size: 100,
    },
    {
      accessorKey: 'due',
      header: 'Due',
      cell: ({ getValue }) => <span>${getValue()}</span>,
      size: 100,
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment Status',
      cell: ({ getValue }) => {
        let className = "px-2 py-1 rounded-full text-xs font-medium ";
        switch(getValue()) {
          case 'Paid':
            className += "bg-green-100 text-green-800";
            break;
          case 'Unpaid':
            className += "bg-red-100 text-red-800";
            break;
          case 'Overdue':
            className += "bg-yellow-100 text-yellow-800";
            break;
          default:
            className += "bg-gray-100 text-gray-800";
        }
        return <span className={className}>{getValue()}</span>;
      },
      size: 120,
    },
    {
      accessorKey: 'biller',
      header: 'Biller',
      size: 100,
    },
    {
      id: 'actions',
      header: '',
      cell: () => (
        <div className="flex justify-center">
          <div className="dropdown">
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
            <div className="dropdown-menu absolute right-0 z-10 hidden mt-1 w-48 rounded-md bg-white shadow-lg">
              <div className="py-1">
                <a href="#" className="dropdown-item">Sale Detail</a>
                <a href="#" className="dropdown-item">Edit Sale</a>
                <a href="#" className="dropdown-item">Show Payments</a>
                <a href="#" className="dropdown-item">Create Payment</a>
                <a href="#" className="dropdown-item">Download pdf</a>
                <a href="#" className="dropdown-item">Delete Sale</a>
              </div>
            </div>
          </div>
        </div>
      ),
      size: 80,
    },
  ];

  // Filtered data
  const filteredData = useMemo(() => {
    return sales.filter(sale => 
      (customerFilter === 'All' || sale.customer.name === customerFilter) &&
      (statusFilter === 'All' || sale.status === statusFilter) &&
      (paymentStatusFilter === 'All' || sale.paymentStatus === paymentStatusFilter) &&
      `${sale.customer.name} ${sale.reference} ${sale.biller}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [sales, search, customerFilter, statusFilter, paymentStatusFilter]);

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
            <h1 className="text-2xl font-bold text-gray-800">POS Orders</h1>
            <p className="text-gray-600">Manage Your pos orders</p>
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
                  <LoopIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <ChevronUpIcon className="w-5 h-5" />
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
                  Add Sales
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
                placeholder="Search sales..."
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select
                className="w-full md:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={customerFilter}
                onChange={e => setCustomerFilter(e.target.value)}
              >
                {customerOptions.map(customer => (
                  <option key={customer} value={customer}>{customer}</option>
                ))}
              </select>
            </div>
            
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select
                className="w-full md:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={paymentStatusFilter}
                onChange={e => setPaymentStatusFilter(e.target.value)}
              >
                {paymentStatusOptions.map(status => (
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
            <div className="text-gray-500">No sales found</div>
            <button 
              className="mt-2 text-blue-600 hover:text-blue-800"
              onClick={() => {
                setSearch('');
                setCustomerFilter('All');
                setStatusFilter('All');
                setPaymentStatusFilter('All');
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