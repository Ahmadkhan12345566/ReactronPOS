import React, { useState, useMemo } from 'react';
import { useUI } from "../ListComponents/useUI";
import { indexColumn, statusColumn } from '../ListComponents/columnHelpers';
import { PrinterIcon } from '@heroicons/react/24/outline';

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

  // Columns configuration
  const columns = [
    indexColumn(),
    {
      accessorKey: 'reference',
      header: 'Reference',
      size: 120,
      cell: ({ getValue }) => (
        <a href="#" className="text-blue-600 hover:underline">{getValue()}</a>
      )
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
      cell: ({ getValue }) => <span>PKR {getValue()}</span>,
      size: 120,    },
    {
      accessorKey: 'paid',
      header: 'Paid',
      cell: ({ getValue }) => <span>PKR {getValue()}</span>,
      size: 100,    },
    {
      accessorKey: 'due',
      header: 'Due',
      cell: ({ getValue }) => <span>PKR {getValue()}</span>,
      size: 100,    },
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
      const passesCustomer = customerFilter === 'All' || report.customer.name === customerFilter;
      const passesPaymentMethod = paymentMethodFilter === 'All';
      const passesPaymentStatus = paymentStatusFilter === 'All' || report.status === paymentStatusFilter;
      const passesSearch = `${report.reference} ${report.customer.name} ${report.status}`
                          .toLowerCase()
                          .includes(search.toLowerCase());
      
      const reportDate = new Date(report.dueDate || new Date());
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const passesFrom = from ? reportDate >= from : true;
      const passesTo = to ? reportDate <= to : true;

      return passesCustomer && passesPaymentMethod && passesPaymentStatus && passesSearch && passesFrom && passesTo;
    });
  }, [reports, search, customerFilter, paymentMethodFilter, paymentStatusFilter, fromDate, toDate]);

  // Use UI hook
  const {
    table,
    controlButtons,
    primaryButtons,
    emptyState
  } = useUI({
    moduleName: 'customer due reports',
    filteredData,
    columns,
    rowSelection: {},
    setRowSelection: () => {},
    onAddItem: false,
    resetFilters: () => {
          setSearch('');
          setCustomerFilter('All');
          setPaymentMethodFilter('All');
          setPaymentStatusFilter('All');
          setFromDate('');
          setToDate('');
        }
  });

  // Add print button to control buttons
  const customControlButtons = [
    ...controlButtons,
    { 
      icon: <PrinterIcon className="w-5 h-5" />,
      onClick: () => window.print(),
      title: 'Print'
    }
  ];



  return (
    <ListContainer>
      <ListHeader 
        title="Customer Due Report"
        description="Manage your customer due reports"
        controlButtons={<ListControlButtons buttons={customControlButtons} />}
      />
      
    <ListFilter>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <DateRangePicker
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
        />

        <SelectField
          name="customer"
          label="Customer"
          value={customerFilter}
          onChange={setCustomerFilter}
          options={customerOptions}
          placeholder="All"
          colClass="md:col-span-3"
        />

        <SelectField
          name="paymentMethod"
          label="Payment Method"
          value={paymentMethodFilter}
          onChange={setPaymentMethodFilter}
          options={paymentMethodOptions}
          placeholder="All"
          colClass="md:col-span-3"
        />

        <SelectField
          name="paymentStatus"
          label="Payment Status"
          value={paymentStatusFilter}
          onChange={setPaymentStatusFilter}
          options={paymentStatusOptions}
          placeholder="All"
          colClass="md:col-span-2"
        />

        <GenerateButton onClick={() => console.log('Generated')} />
      </div>
    </ListFilter>
      
      <ListTable 
        table={table} 
        emptyState={emptyState}
        maxHeight={"max-h-[calc(100vh-30rem)]"}
      />
      
      <ListPagination 
        table={table} 
        dataLength={filteredData.length} 
      />
    </ListContainer>
  );
}