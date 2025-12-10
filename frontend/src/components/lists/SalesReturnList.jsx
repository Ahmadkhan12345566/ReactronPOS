import React, { useState, useMemo } from 'react';
import { useUI } from "../ListComponents/useUI";
import { selectColumn, indexColumn } from '../ListComponents/columnHelpers';

// Reusable components
import ListContainer from '../ListComponents/ListContainer';
import ListHeader from '../ListComponents/ListHeader';
import ListControlButtons from '../ListComponents/ListControlButtons';
import ListFilter from '../ListComponents/ListFilter';
import ListTable from '../ListComponents/ListTable';
import ListPagination from '../ListComponents/ListPagination';
import SearchInput from '../ListComponents/SearchInput';
import SelectField from '../ListComponents/SelectField';

export default function SalesReturnList({ salesReturns, setShowForm }) {
  const [search, setSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [rowSelection, setRowSelection] = useState({});
  
  // Customer options
  const customerOptions = useMemo(() => {
    const customers = [...new Set(salesReturns.map(item => item.customer.name))];
    return ['All', ...customers];
  }, [salesReturns]);
  
  // Status options
  const statusOptions = ['All', 'Received', 'Pending'];
  
  // Payment status options
  const paymentStatusOptions = ['All', 'Paid', 'Unpaid', 'Overdue'];

  // Columns configuration
  const columns = useMemo(() => {
    return [
      selectColumn(),
      indexColumn(),
      {
        accessorKey: 'product',
        header: 'Product',
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
        accessorKey: 'date',
        header: 'Date',
        size: 100,
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
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            getValue() === 'Received' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-cyan-100 text-cyan-800'
          }`}>
            {getValue()}
          </span>
        ),
        size: 100,
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ getValue }) => <span>${getValue()}</span>,
        size: 80,
      },
      {
        accessorKey: 'paid',
        header: 'Paid',
        cell: ({ getValue }) => <span>${getValue()}</span>,
        size: 80,
      },
      {
        accessorKey: 'due',
        header: 'Due',
        cell: ({ getValue }) => <span>${getValue()}</span>,
        size: 80,
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
        id: 'actions',
        header: '',
        cell: () => (
          <div className="flex justify-center">
            <div className="flex space-x-1">
              <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit w-5 h-5">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2 w-5 h-5">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
        ),
        size: 80,
      },
    ];
  }, []);

  // Filtered data
  const filteredData = useMemo(() => {
    return salesReturns.filter(item => 
      (customerFilter === 'All' || item.customer.name === customerFilter) &&
      (statusFilter === 'All' || item.status === statusFilter) &&
      (paymentStatusFilter === 'All' || item.paymentStatus === paymentStatusFilter) &&
      `${item.product.name} ${item.customer.name}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [salesReturns, search, customerFilter, statusFilter, paymentStatusFilter]);

  // Use UI hook
  const {
    table,
    controlButtons,
    emptyState
  } = useUI({
    moduleName: 'sales returns',
    filteredData,
    columns,
    rowSelection,
    setRowSelection,
    onAddItem: false,
    resetFilters: () => {
      setSearch('');
      setCustomerFilter('All');
      setStatusFilter('All');
      setPaymentStatusFilter('All');
    }
  });

  // Add custom buttons to controlButtons
  const customControlButtons = [
    ...controlButtons,
    {
      component: (
        <button 
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Sales Return
        </button>
      )
    }
  ];

  return (
    <ListContainer>
      <ListHeader 
        title="Sales Return"
        description="Manage your returns"
        controlButtons={<ListControlButtons buttons={customControlButtons} />}
      />
      
      <ListFilter>
        <div className="flex flex-wrap items-center justify-between gap-4 w-full">
          <SearchInput 
            search={search} 
            setSearch={setSearch} 
            placeholder="Search sales returns..."
          />

          <div className="flex flex-wrap gap-3">
            <SelectField
              name="customer"
              label="Customer"
              value={customerFilter}
              onChange={setCustomerFilter}
              options={customerOptions}
              placeholder="All"
              widthClass="w-full md:w-40"
            />

            <SelectField
              name="status"
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              placeholder="All"
              widthClass="w-full md:w-40"
            />

            <SelectField
              name="paymentStatus"
              label="Payment Status"
              value={paymentStatusFilter}
              onChange={setPaymentStatusFilter}
              options={paymentStatusOptions}
              placeholder="All"
              widthClass="w-full md:w-40"
            />
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