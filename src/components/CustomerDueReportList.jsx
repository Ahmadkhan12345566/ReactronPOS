import React, { useState, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { PrinterIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function CustomerDueReportList({ reports }) {
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [customerFilter, setCustomerFilter] = useState('All');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  
  // Customer options
  const customerOptions = useMemo(() => {
    const customers = [...new Set(reports.map(report => report.customer.name))];
    return ['All', ...customers];
  }, [reports]);

  // Payment method options
  const paymentMethodOptions = ['All', 'Cash', 'Paypal', 'Stripe', 'Credit Card'];
  
  // Payment status options
  const paymentStatusOptions = ['All', 'Paid', 'Unpaid', 'Completed', 'Overdue'];

  // Export to Excel function
  const exportToExcel = () => {
    const data = filteredData.map((report, index) => ({
      '#': index + 1,
      Reference: report.reference,
      Code: report.code,
      Customer: report.customer.name,
      'Total Amount': `$${report.totalAmount}`,
      Paid: `$${report.paid}`,
      Due: `$${report.due}`,
      Status: report.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Due Reports");
    XLSX.writeFile(workbook, `customer_due_reports_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // Export to PDF function
  const exportToPDF = () => {
    const doc = new jsPDF();
    const headers = [['#', 'Reference', 'Code', 'Customer', 'Total Amount', 'Paid', 'Due', 'Status']];
    const data = filteredData.map((report, index) => [
      index + 1,
      report.reference,
      report.code,
      report.customer.name,
      `$${report.totalAmount}`,
      `$${report.paid}`,
      `$${report.due}`,
      report.status
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 23, 42] }
    });

    doc.save(`customer_due_reports_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Columns configuration
  const columns = [
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
      accessorKey: 'reference',
      header: 'Reference',
      size: 120,
      cell: ({ getValue }) => (
        <a href="#" className="text-blue-600 hover:underline">{getValue()}</a>
      )
    },
    {
      accessorKey: 'code',
      header: 'Code',
      size: 80,
    },
    {
      accessorKey: 'customer',
      header: 'Customer',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="bg-gray-100 rounded-full p-1 mr-3">
            <img 
              src={row.original.customer.image} 
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
      accessorKey: 'totalAmount',
      header: 'Total Amount',
      cell: ({ getValue }) => <span>${getValue()}</span>,
      size: 120,
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
      accessorKey: 'status',
      header: 'Status',
      size: 120,
      cell: ({ getValue }) => {
        const status = getValue();
        let badgeClass = '';
        if (status === 'Paid' || status === 'Completed') {
          badgeClass = 'bg-green-100 text-green-800';
        } else if (status === 'Unpaid') {
          badgeClass = 'bg-red-100 text-red-800';
        } else if (status === 'Overdue') {
          badgeClass = 'bg-purple-100 text-purple-800';
        }
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${badgeClass}`}>
            {status}
          </span>
        );
      }
    }
  ];

  // Filtered data
  const filteredData = useMemo(() => {
    return reports.filter(report => {
      // Customer filter
      const passesCustomer = customerFilter === 'All' || report.customer.name === customerFilter;
      
      // Payment method filter (not in dummy data, so always true for now)
      const passesPaymentMethod = paymentMethodFilter === 'All';
      
      // Payment status filter
      const passesPaymentStatus = paymentStatusFilter === 'All' || report.status === paymentStatusFilter;
      
      // Search filter
      const passesSearch = `${report.reference} ${report.code} ${report.customer.name} ${report.status}`
                          .toLowerCase()
                          .includes(search.toLowerCase());
      
      // Date filter
      const reportDate = new Date(report.dueDate || new Date());
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const passesFrom = from ? reportDate >= from : true;
      const passesTo = to ? reportDate <= to : true;

      return passesCustomer && passesPaymentMethod && passesPaymentStatus && passesSearch && passesFrom && passesTo;
    });
  }, [reports, search, customerFilter, paymentMethodFilter, paymentStatusFilter, fromDate, toDate]);

  // Table instance
  const table = useReactTable({
    data: filteredData,
    columns,
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
            <h1 className="text-2xl font-bold text-gray-800">Customer Due Report</h1>
            <p className="text-gray-600">Manage your customer due reports</p>
          </div>

          <div className='flex gap-1'>
            {/* Control buttons */}
            <div className="flex items-center space-x-2">
              <button onClick={exportToPDF} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <span className="sr-only">Export to PDF</span>
                <img src="/src/assets/icons/pdf.svg" alt="pdf" className="w-5 h-5" />
              </button>
              <button onClick={exportToExcel} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <span className="sr-only">Export to Excel</span>
                <img src="/src/assets/icons/excel.svg" alt="excel" className="w-5 h-5" />
              </button>
              <button onClick={handlePrint} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <span className="sr-only">Print</span>
                <PrinterIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <form onSubmit={e => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Choose Date
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="From"
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="To"
                    value={toDate}
                    onChange={e => setToDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={customerFilter}
                onChange={e => setCustomerFilter(e.target.value)}
              >
                {customerOptions.map(customer => (
                  <option key={customer} value={customer}>{customer}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={paymentMethodFilter}
                onChange={e => setPaymentMethodFilter(e.target.value)}
              >
                {paymentMethodOptions.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={paymentStatusFilter}
                onChange={e => setPaymentStatusFilter(e.target.value)}
              >
                {paymentStatusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-1 flex items-end">
              <button 
                type="submit"
                className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Generate
              </button>
            </div>
          </div>
        </form>
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
        
        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">No customer due reports found</div>
            <button 
              className="mt-2 text-blue-600 hover:text-blue-800"
              onClick={() => {
                setSearch('');
                setCustomerFilter('All');
                setPaymentMethodFilter('All');
                setPaymentStatusFilter('All');
                setFromDate('');
                setToDate('');
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