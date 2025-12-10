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

export default function SalesList({ sales = [], onRefresh, onAddItem }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [customerFilter, setCustomerFilter] = useState('All');
  const [rowSelection, setRowSelection] = useState({});

  const statusOptions = useMemo(() => ['All', 'Completed', 'Pending'], []);
  const paymentStatusOptions = useMemo(() => ['All', 'Paid', 'Unpaid', 'Overdue'], []);

  // derive customer options from sales data
  const customerOptions = useMemo(() => {
    const names = new Set();
    (sales || []).forEach(s => {
      const name = s.Customer?.name || s.customer?.name;
      if (name) names.add(name);
    });
    return ['All', ...Array.from(names)];
  }, [sales]);

  const columns = useMemo(() => [
    selectColumn(),
    indexColumn(),
    {
      accessorKey: 'Customer.name',
      header: 'Customer',
      cell: ({ row }) => (
        <div className="flex items-center">
          <span>{row.original.Customer?.name || row.original.customer?.name || 'N/A'}</span>
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
      size: 140,
      cell: ({ getValue }) => getValue() || 'Unknown'
    },
    actionsColumn(['view', 'edit', 'delete'], 80)
  ], []);

  // Corrected filteredData (use `sales` prop and handle possible field-name variants)
  const filteredData = useMemo(() => {
    const q = (search || '').trim().toLowerCase();

    return (sales || []).filter(item => {
      const customerName = item.Customer?.name || item.customer?.name || '';
      const productName = item.product?.name || item.Product?.name || '';
      const reference = item.reference || '';

      // status could be item.status
      const statusMatch = statusFilter === 'All' || item.status === statusFilter;

      // payment status could be item.payment_status or item.paymentStatus
      const payment = item.payment_status ?? item.paymentStatus ?? '';
      const paymentMatch = paymentStatusFilter === 'All' || payment === paymentStatusFilter;

      // customer filter (if you want exact match; change to includes() if you prefer)
      const customerMatch = customerFilter === 'All' || customerName === customerFilter;

      // search: check reference, customer name, product name
      const searchSource = `${reference} ${customerName} ${productName}`.toLowerCase();
      const searchMatch = !q || searchSource.includes(q);

      return statusMatch && paymentMatch && customerMatch && searchMatch;
    });
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
    onAddItem: onAddItem,
    onSortToggle: () => console.log('Collapse clicked'),
    resetFilters: () => {
      setSearch('');
      setStatusFilter('All');
      setPaymentStatusFilter('All');
      setCustomerFilter('All');
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
        {/* Add a customer filter dropdown */}
        <SelectFilters
          statusFilter={customerFilter}
          setStatusFilter={setCustomerFilter}
          statusOptions={customerOptions}
          placeholder="Customer"
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
