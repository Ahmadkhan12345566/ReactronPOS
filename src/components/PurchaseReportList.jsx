import React, { useState, useMemo } from 'react';
import { useUI } from "./lists/useUI";
import { indexColumn } from './lists/columnHelpers';

// Reusable components
import ListContainer from './lists/ListContainer';
import ListHeader from './lists/ListHeader';
import ListFilter from './lists/ListFilter';
import ListTable from './lists/ListTable';
import ListPagination from './lists/ListPagination';
import DateRangePicker from './lists/DateRangePicker';
import SelectField from './lists/SelectField';
import GenerateButton from './lists/GenerateButton';
import ListControlButtons from './lists/ListControlButtons';

export default function PurchaseReportList({ reports }) {
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [storeFilter, setStoreFilter] = useState('All');
  const [productFilter, setProductFilter] = useState('All');
  
  // Store options
  const storeOptions = ['All', 'Main Store', 'Warehouse', 'Outlet'];
  
  // Product options
  const productOptions = useMemo(() => {
    const products = [...new Set(reports.map(report => report.product.name))];
    return ['All', ...products];
  }, [reports]);

  // Columns configuration
  const columns = [
    indexColumn(),
    {
      accessorKey: 'reference',
      header: 'Reference',
      size: 100,
      cell: ({ getValue }) => (
        <a href="#" className="text-blue-600 hover:underline">{getValue()}</a>
      )
    },
    {
      accessorKey: 'sku',
      header: 'SKU',
      size: 80,
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      size: 120,
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
      accessorKey: 'category',
      header: 'Category',
      size: 100,
    },
    {
      accessorKey: 'stockQty',
      header: 'Instock Qty',
      size: 100,
      meta: { align: 'center' }
    },
    {
      accessorKey: 'purchaseQty',
      header: 'Purchase Qty',
      size: 100,
      meta: { align: 'center' }
    },
    {
      accessorKey: 'purchaseAmount',
      header: 'Purchase Amount',
      cell: ({ getValue }) => <span>${getValue()}</span>,
      size: 120,
    }
  ];

  // Filtered data
  const filteredData = useMemo(() => {
    return reports.filter(report => {
      const passesStore = storeFilter === 'All' || report.store === storeFilter;
      const passesProduct = productFilter === 'All' || report.product.name === productFilter;
      const passesSearch = `${report.reference} ${report.sku} ${report.product.name} ${report.category}`
                          .toLowerCase()
                          .includes(search.toLowerCase());
      
      const reportDate = new Date(report.dueDate);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const passesFrom = from ? reportDate >= from : true;
      const passesTo = to ? reportDate <= to : true;

      return passesStore && passesProduct && passesSearch && passesFrom && passesTo;
    });
  }, [reports, search, storeFilter, productFilter, fromDate, toDate]);

  // Use UI hook
  const {
    table,
    controlButtons,
    emptyState
  } = useUI({
    moduleName: 'purchase reports',
    filteredData,
    columns,
    rowSelection: {},
    setRowSelection: () => {},
    onAddItem: false,
    resetFilters: () => {
      setSearch('');
      setStoreFilter('All');
      setProductFilter('All');
      setFromDate('');
      setToDate('');
    }
  });

  return (
    <ListContainer>
      <ListHeader 
        title="Purchase Report"
        description="Manage your purchase reports"
        controlButtons={<ListControlButtons buttons={controlButtons} />}
      />
      
      <ListFilter>
          <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
            <div className="md:col-span-4">
              <DateRangePicker
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
              />
            </div>

            <SelectField
              name="store"
              label="Store"
              value={storeFilter}
              onChange={setStoreFilter}
              options={storeOptions}
              placeholder="All Stores"
              colClass="md:col-span-3"
            />

            <SelectField
              name="product"
              label="Product"
              value={productFilter}
              onChange={setProductFilter}
              options={productOptions}
              placeholder="All Products"
              colClass="md:col-span-2"
            />

            <div className="md:col-span-1 flex items-end">
              <GenerateButton onClick={() => console.log('Generate report')} />
            </div>
          </div>
      </ListFilter>
      
      <ListTable 
        table={table} 
        emptyState={emptyState}
        maxHeight={"max-h-[calc(100vh-26rem)]"}
      />
      
      <ListPagination 
        table={table} 
        dataLength={filteredData.length} 
      />
    </ListContainer>
  );
}