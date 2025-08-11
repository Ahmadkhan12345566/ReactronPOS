import React, { useState, useMemo } from 'react';
import { useUI } from "./lists/useUI";
import { selectColumn, imageColumn, statusColumn, actionsColumn } from './lists/columnHelpers';

// Reusable components
import ListContainer from './lists/ListContainer';
import ListHeader from './lists/ListHeader';
import ListControlButtons from './lists/ListControlButtons';
import ListFilter from './lists/ListFilter';
import ListTable from './lists/ListTable';
import ListPagination from './lists/ListPagination';
import SearchInput from './lists/SearchInput';
import SelectFilters from './lists/SelectFilters';

export default function CustomerList({ customers, setShowForm }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [rowSelection, setRowSelection] = useState({});
  
  // Status options
  const statusOptions = useMemo(() => ['All', 'Active', 'Inactive'], []);

  // Columns configuration using helpers
  const columns = [
    selectColumn(),
    {
      accessorKey: 'code',
      header: 'Code',
      size: 100,
    },
    imageColumn('name', 'Customer', 'avatar'),
    {
      accessorKey: 'email',
      header: 'Email',
      size: 200,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      size: 120,
    },
    {
      accessorKey: 'country',
      header: 'Country',
      size: 120,
    },
    statusColumn('status', 'Status'),
    actionsColumn(['view', 'edit', 'delete'])
  ];

  // Filtered data
  const filteredData = useMemo(() => {
    return customers.filter(customer => 
      (statusFilter === 'All' || customer.status === statusFilter) &&
      `${customer.name} ${customer.email} ${customer.phone} ${customer.country}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [customers, search, statusFilter]);

  // Use UI hook
  const {
    table,
    controlButtons,
    primaryButtons,
    emptyState
  } = useUI({
    moduleName: 'customers',
    filteredData,
    columns,
    rowSelection,
    setRowSelection,
    onAddItem: () => setShowForm(true),
    resetFilters: () => {
          setSearch('');
          setStatusFilter('All');
          setRowSelection({});
        }
  });

  

  return (
    <ListContainer>
      <ListHeader 
        title="Customers"
        description="Manage your customers"
        controlButtons={<ListControlButtons buttons={controlButtons} />}
        primaryButtons={primaryButtons.map((btn, i) => (
          <React.Fragment key={i}>{btn.element}</React.Fragment>
        ))}
      />
      
      <ListFilter>
        <SearchInput search={search} setSearch={setSearch}/>
        <SelectFilters 
          statusFilter={statusFilter} 
          setStatusFilter={setStatusFilter} 
          statusOptions={statusOptions} 
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