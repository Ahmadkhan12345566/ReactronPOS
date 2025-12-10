import React, { useState, useMemo } from 'react';
import { useUI } from "../ListComponents/useUI";
import { indexColumn } from '../ListComponents/columnHelpers';

// Reusable components
import ListContainer from '../ListComponents/ListContainer';
import ListHeader from '../ListComponents/ListHeader';
import ListControlButtons from '../ListComponents/ListControlButtons';
import ListFilter from '../ListComponents/ListFilter';
import ListTable from '../ListComponents/ListTable';
import ListPagination from '../ListComponents/ListPagination';
import DateRangePicker from '../ListComponents/DateRangePicker';
import SelectField from '../ListComponents/SelectField';
import GenerateButton from '../ListComponents/GenerateButton';
import { PrinterIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { 
  CurrencyDollarIcon, 
  ClipboardDocumentCheckIcon, 
  BanknotesIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

export default function SalesReportList({ reports }) {
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [storeFilter, setStoreFilter] = useState('All');
  const [productFilter, setProductFilter] = useState('All');
  
  // Store options
  const storeOptions = ['All', 'Electro Mart', 'Quantum Gadgets', 'Prime Bazaar'];
  
  // Product options
  const productOptions = useMemo(() => {
    const products = [...new Set(reports.map(report => report.product.name))];
    return ['All', ...products];
  }, [reports]);

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Columns configuration
  const columns = useMemo(() => {
    return [
      indexColumn(),
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
        cell: ({ row }) => <span>{row.original.product.brand || 'No Brand'}</span>,
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
  }, []);

  // Filtered data
  const filteredData = useMemo(() => {
    return reports.filter(report => {
      const passesStore   = storeFilter   === 'All' || report.store === storeFilter;
      const passesProduct = productFilter === 'All' || report.product.name === productFilter;
      const passesSearch  = `${report.sku} ${report.product.name} ${report.product.brand} ${report.category}`
                            .toLowerCase()
                            .includes(search.toLowerCase());

      const reportDate = new Date(report.dueDate);
      const from       = fromDate ? new Date(fromDate) : null;
      const to         = toDate   ? new Date(toDate)   : null;

      const passesFrom = from ? reportDate >= from : true;
      const passesTo   = to   ? reportDate <= to   : true;

      return passesStore && passesProduct && passesSearch && passesFrom && passesTo;
    });
  }, [reports, search, storeFilter, productFilter, fromDate, toDate]);

  // Sales summary data
  const salesSummary = [
    { title: 'Total Amount', value: '$4,56,000', icon: CurrencyDollarIcon, color: 'bg-green-500' },
    { title: 'Total Paid', value: '$2,56,42', icon: ClipboardDocumentCheckIcon, color: 'bg-blue-500' },
    { title: 'Total Unpaid', value: '$1,52,45', icon: BanknotesIcon, color: 'bg-orange-500' },
    { title: 'Overdue', value: '$2,56,12', icon: ExclamationCircleIcon, color: 'bg-red-500' }
  ];

  // Use UI hook
  const {
    table,
    controlButtons,
    primaryButtons,
    emptyState
  } = useUI({
    moduleName: 'sales reports',
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

  // Add custom buttons to controlButtons
  const customControlButtons = [
    ...controlButtons,
    { 
      icon: <PrinterIcon className="w-5 h-5" />,
      onClick: handlePrint,
      title: 'Print'
    },
    { 
      icon: <ChevronUpIcon className="w-5 h-5" />,
      onClick: () => console.log('Chevron clicked'),
      title: 'More options'
    }
  ];

  return (
    <ListContainer>
      <ListHeader 
        title="Sales Report"
        description="Manage your sales reports"
        controlButtons={<ListControlButtons buttons={customControlButtons} />}
      />
      
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

      <ListFilter>
        <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
          <DateRangePicker
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
            colClass="md:col-span-3"
          />

          <SelectField
            name="store"
            label="Store"
            value={storeFilter}
            onChange={setStoreFilter}
            options={storeOptions}
            placeholder="All"
            colClass="md:col-span-3"
          />

          <SelectField
            name="product"
            label="Products"
            value={productFilter}
            onChange={setProductFilter}
            options={productOptions}
            placeholder="All"
            colClass="md:col-span-3"
          />

          <GenerateButton onClick={() => console.log('Generated')} />
        </div>
      </ListFilter>
      
      <ListTable 
        table={table} 
        emptyState={emptyState}
        maxHeight={"max-h-[calc(100vh-32rem)]"}
      />
      
      <ListPagination 
        table={table} 
        dataLength={filteredData.length} 
      />
    </ListContainer>
  );
}