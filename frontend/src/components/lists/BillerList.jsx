import React, { useState, useMemo } from 'react';
import { useUI } from "../ListComponents/useUI";
import { selectColumn, statusColumn, actionsColumn } from '../ListComponents/columnHelpers';

// Reusable components
import ListContainer from '../ListComponents/ListContainer';
import ListHeader from '../ListComponents/ListHeader';
import ListControlButtons from '../ListComponents/ListControlButtons';
import ListFilter from '../ListComponents/ListFilter';
import ListTable from '../ListComponents/ListTable';
import ListPagination from '../ListComponents/ListPagination';
import SearchInput from '../ListComponents/SearchInput';
import SelectFilters from '../ListComponents/SelectFilters';

export default function BillerList({ Billers, setShowForm }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [rowSelection, setRowSelection] = useState({});
  
  // Status options
  const statusOptions = useMemo(() => ['All', 'Active', 'Inactive'], []);

  // Updated columns to match User model - CALL the helper functions
  const columns = [
    selectColumn(), // ← Add parentheses to call the function
    {
      id: 'name', // ← Add id property
      accessorKey: 'name',
      header: 'Name',
      size: 150,
    },
    {
      id: 'email', // ← Add id property
      accessorKey: 'email',
      header: 'Email',
      size: 200,
    },
    {
      id: 'role', // ← Add id property
      accessorKey: 'role',
      header: 'Role',
      size: 120,
    },
    statusColumn('status', 'Status'), // ← Call with parameters
    actionsColumn(['view', 'edit', 'delete']) // ← Call with parameters
  ];

  // Filtered data - updated to match User model fields
  const filteredData = useMemo(() => {
    return Billers.filter(biller => 
      (statusFilter === 'All' || biller.status === statusFilter) &&
      `${biller.name || ''} ${biller.email || ''} ${biller.role || ''}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [Billers, search, statusFilter]);

  // Use UI hook
  const {
    table,
    controlButtons,
    primaryButtons,
    emptyState
  } = useUI({
    moduleName: 'billers',
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
        title="Billers"
        description="Manage your billers"
        controlButtons={<ListControlButtons buttons={controlButtons} />}
        primaryButtons={primaryButtons.map((btn, i) => (
          <React.Fragment key={i}>{btn.element}</React.Fragment>
        ))}
      />
      
      <ListFilter>
        <SearchInput search={search} setSearch={setSearch} placeholder="Search billers..." />
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