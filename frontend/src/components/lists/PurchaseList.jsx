import React, { useState, useMemo } from 'react';
import { usePos } from '../../hooks/usePos';
import {
  TrashIcon, 
  EyeIcon, 
  PencilIcon,
} from '@heroicons/react/24/outline';
// Reusable components
import ListContainer from '../ListComponents/ListContainer';
import ListHeader from '../ListComponents/ListHeader';
import ListControlButtons from '../ListComponents/ListControlButtons';
import ListFilter from '../ListComponents/ListFilter';
import ListTable from '../ListComponents/ListTable';
import ListPagination from '../ListComponents/ListPagination';
import SearchInput from '../ListComponents/SearchInput';
import SelectFilters from '../ListComponents/SelectFilters';
import { useUI } from "../ListComponents/useUI";
import { selectColumn, indexColumn, statusColumn, actionsColumn } from '../ListComponents/columnHelpers';

const PurchaseList = ({ purchases = [], onAddPurchase }) => {
  const [search, setSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [rowSelection, setRowSelection] = useState({});
  const { currentUser } = usePos();

  // Payment status options
  const paymentStatusOptions = useMemo(() => ['All', 'Paid', 'Unpaid', 'Overdue'], []);

  // Format currency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  // Columns configuration
  const columns = [
    selectColumn(),
    indexColumn(),
    {
      accessorKey: 'supplier',
      header: 'Supplier Name',
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
      cell: ({ getValue }) => {
        const date = getValue();
        return date ? new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : '-';
      }
    },
    statusColumn('status', 'Status'),
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ getValue }) => <span>{formatCurrency(getValue())}</span>,
      size: 100,
    },
    {
      accessorKey: 'paid',
      header: 'Paid',
      cell: ({ getValue }) => <span>{formatCurrency(getValue())}</span>,
      size: 100,
    },
    {
      accessorKey: 'due',
      header: 'Due',
      cell: ({ getValue }) => <span>{formatCurrency(getValue())}</span>,
      size: 100,
    },
    statusColumn('paymentStatus', 'Payment Status', 120),
    actionsColumn(["view", 'edit', 'delete'])
  ];

  // Filtered data
  const filteredData = useMemo(() => {
    return purchases.filter(purchase => 
      (paymentStatusFilter === 'All' || purchase.paymentStatus === paymentStatusFilter) &&
      `${purchase.supplier || ''} ${purchase.reference || ''} ${purchase.date || ''} ${purchase.status || ''} ${purchase.paymentStatus || ''}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [purchases, search, paymentStatusFilter]);

  // useUI.jsx
  const {
    table,
    controlButtons,
    primaryButtons,
    emptyState,
  } = useUI({
    moduleName: 'purchases',
    filteredData,
    columns,
    rowSelection,
    setRowSelection,
    onAddItem: onAddPurchase,
    isAddDisabled: currentUser.role !== 'admin',
    onSortToggle: (() => console.log('Collapse clicked')),
    resetFilters: () => {
      setSearch('');
      setPaymentStatusFilter('All');
      setRowSelection({});
    }
  });

  // Return Statement
  return (
    <ListContainer>
      <ListHeader 
        title="Purchases"
        description="Manage your purchases"
        controlButtons={<ListControlButtons buttons={controlButtons} />}
        primaryButtons={primaryButtons.map((btn, i) => (
          <React.Fragment key={i}>{btn.element}</React.Fragment>
        ))}
      />
      
      <ListFilter>
        <SearchInput search={search} setSearch={setSearch} placeholder="Search purchases..." />  
        <SelectFilters 
          statusFilter={paymentStatusFilter} 
          setStatusFilter={setPaymentStatusFilter} 
          statusOptions={paymentStatusOptions} 
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
};


export default PurchaseList;