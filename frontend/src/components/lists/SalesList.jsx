// SaleList.jsx
import React, { useState, useMemo } from 'react';
// Import reusable components
import ListContainer from '../ListComponents/ListContainer';
import ListHeader from '../ListComponents/ListHeader';
import ListControlButtons from '../ListComponents/ListControlButtons';
import ListFilter from '../ListComponents/ListFilter';
import ListTable from '../ListComponents/ListTable';
import ListPagination from '../ListComponents/ListPagination';
import SearchInput from '../ListComponents/SearchInput';
import SelectFilters from '../ListComponents/SelectFilters';

// Reusable helpers + UI hook
import {
  selectColumn,
  indexColumn,
  actionsColumn,
  imageColumn,
  statusColumn
} from '../ListComponents/columnHelpers';
import { useUI } from '../ListComponents/useUI';

export default function SalesList({ sales, setShowForm }) {
  {window.setShowForm = setShowForm}
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

  // Columns configuration (use helpers where appropriate)
  const columns = useMemo(() => ([
    selectColumn(),
    indexColumn(),
    {
      accessorKey: 'customer',
      header: 'Customer',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="bg-gray-100 rounded-full p-1 mr-3">
            <img
              src={row.original.customer?.avatar}
              alt={row.original.customer?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
          <span>{row.original.customer?.name}</span>
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
    statusColumn('status', 'Status', 100),
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
    statusColumn('paymentStatus', 'Payment Status', 120),
    {
      accessorKey: 'biller',
      header: 'Biller',
      size: 100,
    },
    actionsColumn(['view', 'edit', 'delete'], 80)
  ]), []);

  // Filtered data (no logic changes)
  const filteredData = useMemo(() => {
    return sales.filter(sale =>
      (customerFilter === 'All' || sale.customer.name === customerFilter) &&
      (statusFilter === 'All' || sale.status === statusFilter) &&
      (paymentStatusFilter === 'All' || sale.paymentStatus === paymentStatusFilter) &&
      `${sale.customer.name} ${sale.reference} ${sale.biller}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [sales, search, customerFilter, statusFilter, paymentStatusFilter]);

  const {
    table,
    controlButtons,
    primaryButtons,
    emptyState
  } = useUI({
    moduleName: 'sales',
    filteredData,
    columns,
    rowSelection,
    setRowSelection,
    onAddItem: () => setShowForm(true),
    onSortToggle: () => console.log('Collapse clicked'),
    resetFilters: () => {
          setSearch('');
          setCustomerFilter('All');
          setStatusFilter('All');
          setPaymentStatusFilter('All');
        }
  });

  
  return (
    <ListContainer>
      <ListHeader
        title="POS Orders"
        description="Manage Your pos orders"
        controlButtons={<ListControlButtons buttons={controlButtons} />}
        primaryButtons={primaryButtons.map((btn, i) => <React.Fragment key={i}>{btn.element}</React.Fragment>)}
      />

      <ListFilter>
        <SearchInput search={search} setSearch={setSearch} />
        <SelectFilters statusFilter={statusFilter} setStatusFilter={setStatusFilter} statusOptions={statusOptions} />
      </ListFilter>

      <ListTable
        table={table}
        emptyState={filteredData.length === 0 ? emptyState : emptyState}
        maxHeight={"max-h-[calc(100vh-26rem)]"}
      />

      <ListPagination
        table={table}
        dataLength={filteredData.length}
      />
    </ListContainer>
  );
}
