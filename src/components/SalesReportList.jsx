import React, { useState, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { PrinterIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { 
  CurrencyDollarIcon, 
  ClipboardDocumentCheckIcon, 
  BanknotesIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function SalesReportList({ reports }) {
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [storeFilter, setStoreFilter] = useState('All');
  const [productFilter, setProductFilter] = useState('All');
  const [rowSelection, setRowSelection] = useState({});
  
  // Store options
  const storeOptions = useMemo(() => {
    return ['All', 'Electro Mart', 'Quantum Gadgets', 'Prime Bazaar'];
  }, []);
  
  // Product options
  const productOptions = useMemo(() => {
    const products = [...new Set(reports.map(report => report.product.name))];
    return ['All', ...products];
  }, [reports]);

  // Export to Excel function
  const exportToExcel = () => {
    const data = filteredData.map((report, index) => ({
      '#': index + 1,
      SKU: report.sku,
      'Product Name': report.product.name,
      Brand: report.product.brand,
      Category: report.category,
      'Sold Qty': report.soldQty,
      'Sold Amount': `$${report.soldAmount}`,
      'Instock Qty': report.stockQty
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Reports");
    XLSX.writeFile(workbook, `sales_reports_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // Export to PDF function
  const exportToPDF = () => {
    const doc = new jsPDF();
    const headers = [['#', 'SKU', 'Product Name', 'Brand', 'Category', 'Sold Qty', 'Sold Amount', 'Instock Qty']];
    const data = filteredData.map((report, index) => [
      index + 1,
      report.sku,
      report.product.name,
      report.product.brand,
      report.category,
      report.soldQty,
      `$${report.soldAmount}`,
      report.stockQty
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 23, 42] }
    });

    doc.save(`sales_reports_${new Date().toISOString().slice(0,10)}.pdf`);
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
      accessorKey: 'sku',
      header: 'SKU',
      size: 80,
      cell: ({ getValue }) => (
        <a href="#" className="text-blue-600 hover:underline">{getValue()}</a>
      )
    },
    {
      accessorKey: 'product',
      header: 'Product Name',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="bg-gray-100 rounded-full p-1 mr-3">
            <img 
              src={row.original.product.image} 
              alt={row.original.product.name} 
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
          <span>{row.original.product.name}</span>
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: 'product.brand',
      header: 'Brand',
      size: 120,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      size: 100,
    },
    {
      accessorKey: 'soldQty',
      header: 'Sold Qty',
      size: 100,
      meta: { align: 'center' }
    },
    {
      accessorKey: 'soldAmount',
      header: 'Sold Amount',
      cell: ({ getValue }) => <span>${getValue()}</span>,
      size: 120,
    },
    {
      accessorKey: 'stockQty',
      header: 'Instock Qty',
      size: 100,
      meta: { align: 'center' }
    }
  ];

  // Filtered data
  const filteredData = useMemo(() => {
    return reports.filter(report => {
      // 1) existing filters
      const passesStore   = storeFilter   === 'All' || report.store === storeFilter;
      const passesProduct = productFilter === 'All' || report.product.name === productFilter;
      const passesSearch  = `${report.sku} ${report.product.name} ${report.product.brand} ${report.category}`
                            .toLowerCase()
                            .includes(search.toLowerCase());

      // 2) date filters
      // assume report.dueDate is ISO (YYYY-MM-DD) or parseable by Date()
      const reportDate = new Date(report.dueDate);
      const from       = fromDate ? new Date(fromDate) : null;
      const to         = toDate   ? new Date(toDate)   : null;

      const passesFrom = from ? reportDate >= from : true;
      const passesTo   = to   ? reportDate <= to   : true;

      return passesStore && passesProduct && passesSearch && passesFrom && passesTo;
    });
  }, [reports, search, storeFilter, productFilter, fromDate, toDate]);

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

  // Sales summary data (hardcoded for now)
  const salesSummary = [
    { title: 'Total Amount', value: '$4,56,000', icon: CurrencyDollarIcon, color: 'bg-green-500' },
    { title: 'Total Paid', value: '$2,56,42', icon: ClipboardDocumentCheckIcon, color: 'bg-blue-500' },
    { title: 'Total Unpaid', value: '$1,52,45', icon: BanknotesIcon, color: 'bg-orange-500' },
    { title: 'Overdue', value: '$2,56,12', icon: ExclamationCircleIcon, color: 'bg-red-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Sales Report</h1>
            <p className="text-gray-600">Manage your sales reports</p>
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
              <button onClick={handlePrint} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <PrinterIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <ChevronUpIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {salesSummary.map((item, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <span className={`${item.color} p-3 rounded-full mr-4`}>
                <item.icon className="h-6 w-6 text-white" />
              </span>
              <div>
                <p className="text-sm font-medium text-gray-600">{item.title}</p>
                <h3 className="text-xl font-bold">{item.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <form onSubmit={e => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
            <div className="md:col-span-3 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Store</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={storeFilter}
                onChange={e => setStoreFilter(e.target.value)}
              >
                {storeOptions.map(store => (
                  <option key={store} value={store}>{store}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Products</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={productFilter}
                onChange={e => setProductFilter(e.target.value)}
              >
                {productOptions.map(product => (
                  <option key={product} value={product}>{product}</option>
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
            <div className="text-gray-500">No sales reports found</div>
            <button 
              className="mt-2 text-blue-600 hover:text-blue-800"
              onClick={() => {
                setSearch('');
                setStoreFilter('All');
                setProductFilter('All');
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