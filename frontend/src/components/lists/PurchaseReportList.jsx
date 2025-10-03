import React, { useState, useMemo } from 'react';
import { useUI } from "../ListComponents/useUI";
import { indexColumn } from '../ListComponents/columnHelpers';

// Reusable components
import ListContainer from '../ListComponents/ListContainer';
import ListHeader from '../ListComponents/ListHeader';
import ListFilter from '../ListComponents/ListFilter';
import ListTable from '../ListComponents/ListTable';
import ListPagination from '../ListComponents/ListPagination';
import DateRangePicker from '../ListComponents/DateRangePicker';
import SelectField from '../ListComponents/SelectField';
import GenerateButton from '../ListComponents/GenerateButton';
import ListControlButtons from '../ListComponents/ListControlButtons';
import SearchInput from '../ListComponents/SearchInput';

export default function PurchaseReportList({ reports }) {
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('All');
  const [productFilter, setProductFilter] = useState('All');
  
  // Supplier options
  const supplierOptions = ['All', 'Main Supplier', 'Electro Mart', 'Prime Suppliers'];
  
  // Product options
  const productOptions = useMemo(() => {
    const products = [...new Set(reports.map(report => report.product?.name).filter(Boolean))];
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
        <a href="#" className="text-blue-600 hover:underline">{getValue() || 'N/A'}</a>
      )
    },
    {
      accessorKey: 'sku',
      header: 'SKU',
      size: 80,
      cell: ({ getValue }) => <span>{getValue() || 'N/A'}</span>,
    },
    {
      accessorKey: 'dueDate',
      header: 'Date',
      cell: ({ getValue }) => getValue ? new Date(getValue()).toLocaleDateString() : 'N/A',
      size: 120,
    },
    {
      accessorKey: 'product',
      header: 'Product Name',
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.product?.image && (
            <div className="bg-gray-100 rounded-full p-1 mr-3">
              <img 
                src={row.original.product.image} 
                alt={row.original.product.name} 
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
          )}
          <span>{row.original.product?.name || 'Unknown Product'}</span>
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ getValue }) => <span>{getValue() || 'Uncategorized'}</span>,
      size: 100,
    },
    {
      accessorKey: 'stockQty',
      header: 'Instock Qty',
      cell: ({ getValue }) => <span className="text-center block">{getValue() || 0}</span>,
      size: 100,
      meta: { align: 'center' }
    },
    {
      accessorKey: 'purchaseQty',
      header: 'Purchase Qty',
      cell: ({ getValue }) => <span className="text-center block">{getValue() || 0}</span>,
      size: 100,
      meta: { align: 'center' }
    },
    {
      accessorKey: 'purchaseAmount',
      header: 'Purchase Amount',
      cell: ({ getValue }) => <span>${getValue() || 0}</span>,
      size: 120,
    }
  ];

  // Filtered data
  const filteredData = useMemo(() => {
    return reports.filter(report => {
      const passesSupplier = supplierFilter === 'All' || report.supplier === supplierFilter;
      const passesProduct = productFilter === 'All' || report.product?.name === productFilter;
      const passesSearch = `${report.reference || ''} ${report.sku || ''} ${report.product?.name || ''} ${report.category || ''}`
                          .toLowerCase()
                          .includes(search.toLowerCase());
      
      const reportDate = report.dueDate ? new Date(report.dueDate) : null;
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const passesFrom = from && reportDate ? reportDate >= from : true;
      const passesTo = to && reportDate ? reportDate <= to : true;

      return passesSupplier && passesProduct && passesSearch && passesFrom && passesTo;
    });
  }, [reports, search, supplierFilter, productFilter, fromDate, toDate]);

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
      setSupplierFilter('All');
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
        <div className="flex flex-wrap items-center justify-between gap-4 w-full">
          <SearchInput 
            search={search} 
            setSearch={setSearch} 
            placeholder="Search purchase reports..."
          />

          <div className="flex flex-wrap gap-3">
            <DateRangePicker
              fromDate={fromDate}
              toDate={toDate}
              setFromDate={setFromDate}
              setToDate={setToDate}
            />

            <SelectField
              name="supplier"
              label="Supplier"
              value={supplierFilter}
              onChange={setSupplierFilter}
              options={supplierOptions}
              placeholder="All Suppliers"
              widthClass="w-full md:w-40"
            />

            <SelectField
              name="product"
              label="Product"
              value={productFilter}
              onChange={setProductFilter}
              options={productOptions}
              placeholder="All Products"
              widthClass="w-full md:w-40"
            />

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