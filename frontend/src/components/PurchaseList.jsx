import React, { useState, useMemo } from 'react';
import {
  TrashIcon, 
  EyeIcon, 
  PencilIcon,
} from '@heroicons/react/24/outline';
// Reusable components
import ListContainer from './lists/ListContainer';
import ListHeader from './lists/ListHeader';
import ListControlButtons from './lists/ListControlButtons';
import ListFilter from './lists/ListFilter';
import ListTable from './lists/ListTable';
import ListPagination from './lists/ListPagination';
import SearchInput from './lists/SearchInput';
import SelectFilters from './lists/SelectFilters';
import { useUI } from "./lists/useUI";
import { selectColumn, indexColumn, statusColumn, actionsColumn, imageColumn } from './lists/columnHelpers';

const PurchaseList = ({ purchases, onAddPurchase }) => {
  const [search, setSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [rowSelection, setRowSelection] = useState({});

  // Payment status options
  const paymentStatusOptions = useMemo(() => ['All', 'Paid', 'Unpaid', 'Overdue'], []);

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
  },
  statusColumn('status', 'Status'),
  {
    accessorKey: 'total',
    header: 'Total',
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
  actionsColumn(["view", 'edit', 'delete'])
];

  // Filtered data
  const filteredData = useMemo(() => {
    return purchases.filter(purchase => 
      (paymentStatusFilter === 'All' || purchase.paymentStatus === paymentStatusFilter) &&
      `${purchase.supplier} ${purchase.reference} ${purchase.date} ${purchase.status} ${purchase.paymentStatus}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [purchases, search, paymentStatusFilter]);

  //useUI.jsx
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
  onSortToggle: (() => console.log('Collapse clicked')),
  resetFilters: () => {
          setSearch('');
          setPaymentStatusFilter('All');
          setRowSelection({});
        }
});

//Return Statment
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
          <SearchInput search={search} setSearch={setSearch} />  
         
          <SelectFilters statusFilter={paymentStatusFilter} setStatusFilter={setPaymentStatusFilter} statusOptions={paymentStatusOptions} />
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

