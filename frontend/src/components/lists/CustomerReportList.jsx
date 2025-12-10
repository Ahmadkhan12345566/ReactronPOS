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
import { PrinterIcon } from '@heroicons/react/24/outline';

export default function CustomerReportList({ reports }) {
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
  const paymentStatusOptions = ['All', 'Completed', 'Unpaid', 'Paid', 'Overdue'];

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Columns configuration
  const columns = useMemo(() => {
    return [
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
        accessorKey: 'totalOrders',
        header: 'Total Orders',
        size: 100,
        meta: { align: 'center' }
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ getValue }) => <span>PKR {getValue()}</span>,
        size: 100,
      },
      {
        accessorKey: 'paymentMethod',
        header: 'Payment Method',
        size: 120,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
        cell: ({ getValue }) => (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
            {getValue()}
          </span>
        )
      }
    ];
  }, []);

  // Filtered data
  const filteredData = useMemo(() => {
    return reports.filter(report => {
      // Customer filter
      const passesCustomer = customerFilter === 'All' || report.customer.name === customerFilter;
      
      // Payment method filter
      const passesPaymentMethod = paymentMethodFilter === 'All' || 
        (report.paymentMethod && report.paymentMethod === paymentMethodFilter);
      
      // Payment status filter
      const passesPaymentStatus = paymentStatusFilter === 'All' || report.status === paymentStatusFilter;
      
      // Search filter
      const searchFields =
        `${report.reference} ${report.customer.name} ${report.paymentMethod} ${report.status}`;
        
      const passesSearch = searchFields
        .toLowerCase()
        .includes(search.toLowerCase());
      
      // Date filter
      const reportDate = new Date(report.reportDate || report.dueDate || new Date());
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const passesFrom = from ? reportDate >= from : true;
      const passesTo = to ? reportDate <= to : true;

      return passesCustomer && passesPaymentMethod && passesPaymentStatus && passesSearch && passesFrom && passesTo;
    });
  }, [reports, search, customerFilter, paymentMethodFilter, paymentStatusFilter, fromDate, toDate]);

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return filteredData.reduce((sum, report) => sum + report.amount, 0);
  }, [filteredData]);

  // Use UI hook
  const {
    table,
    controlButtons,
    primaryButtons,
    emptyState
  } = useUI({
    moduleName: 'customer reports',
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

  // Add custom buttons to controlButtons
  const customControlButtons = [
    ...controlButtons,
    { 
      icon: <PrinterIcon className="w-5 h-5" />,
      onClick: handlePrint,
      title: 'Print'
    }
  ];

  return (
    <ListContainer>
      <ListHeader 
        title="Customer Report"
        description="Manage your customer reports"
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
        maxHeight={"max-h-[calc(100vh-35rem)]"}
      />
      
      {filteredData.length > 0 && (
        <div className="bg-gray-100 rounded-b-xl p-4 border-t border-gray-300">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total</span>
            <span className="font-bold">PKR {totalAmount.toFixed(2)}</span>
          </div>
        </div>
      )}
      
      <ListPagination 
        table={table} 
        dataLength={filteredData.length} 
      />
    </ListContainer>
  );
}