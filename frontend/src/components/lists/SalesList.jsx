import React, { useState, useMemo } from 'react';
import ListContainer from '../ListComponents/ListContainer';
import ListHeader from '../ListComponents/ListHeader';
import ListControlButtons from '../ListComponents/ListControlButtons';
import ListFilter from '../ListComponents/ListFilter';
import ListTable from '../ListComponents/ListTable';
import ListPagination from '../ListComponents/ListPagination';
import SearchInput from '../ListComponents/SearchInput';
import SelectFilters from '../ListComponents/SelectFilters';
import {
  selectColumn,
  indexColumn,
  actionsColumn,
  statusColumn
} from '../ListComponents/columnHelpers';
import { useUI } from '../ListComponents/useUI';

export default function SalesList({ sales, onRefresh }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [rowSelection, setRowSelection] = useState({});

  const statusOptions = useMemo(() => ['All', 'Completed', 'Pending'], []);
  const paymentStatusOptions = useMemo(() => ['All', 'Paid', 'Unpaid', 'Overdue'], []);

  const columns = useMemo(() => [
    selectColumn(),
    indexColumn(),
    {
      accessorKey: 'Customer.name',
      header: 'Customer',
      cell: ({ row }) => (
        <div className="flex items-center">
          <span>{row.original.Customer?.name || 'N/A'}</span>
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
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      size: 120,
    },
    statusColumn('status', 'Status', 100),
    {
      accessorKey: 'total',
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
    statusColumn('payment_status', 'Payment Status', 120),
    {
      accessorKey: 'User.name',
      header: 'Biller',
      size: 100,
    },
    actionsColumn(['view', 'edit', 'delete'], 80)
  ], []);

  // Update filteredData to use correct field names
  const filteredData = useMemo(() => {
    return salesReturns.filter(item => 
      (customerFilter === 'All' || item.customer.name === customerFilter) &&
      (statusFilter === 'All' || item.status === statusFilter) &&
      (paymentStatusFilter === 'All' || item.paymentStatus === paymentStatusFilter) &&
      `${item.product?.name || ''} ${item.customer.name}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [salesReturns, search, customerFilter, statusFilter, paymentStatusFilter]);

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
    onAddItem: () => console.log('Add sale'),
    onSortToggle: () => console.log('Collapse clicked'),
    resetFilters: () => {
      setSearch('');
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
        primaryButtons={primaryButtons.map((btn, i) => (
          <React.Fragment key={i}>{btn.element}</React.Fragment>
        ))}
      />

      <ListFilter>
        <SearchInput search={search} setSearch={setSearch} />
        <SelectFilters 
          statusFilter={statusFilter} 
          setStatusFilter={setStatusFilter} 
          statusOptions={statusOptions} 
        />
        <SelectFilters 
          statusFilter={paymentStatusFilter} 
          setStatusFilter={setPaymentStatusFilter} 
          statusOptions={paymentStatusOptions} 
          placeholder="Payment Status"
        />
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