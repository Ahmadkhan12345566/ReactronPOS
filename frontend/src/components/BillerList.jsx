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

export default function BillerList({ Billers, setShowForm }) {
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
    imageColumn('name', 'Biller', 'avatar'),
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
      accessorKey: 'company',
      header: 'Company',
      size: 120,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          getValue() === 'Active' 
            ? 'text-success bg-success-transparent' 
            : 'text-danger bg-danger-transparent'
        }`}>
          {getValue()}
        </span>
      ),
      size: 100,
    },
    actionsColumn(['view', 'edit', 'delete'])
  ];

  // Filtered data
  const filteredData = useMemo(() => {
    return Billers.filter(Biller => 
      (statusFilter === 'All' || Biller.status === statusFilter) &&
      `${Biller.name} ${Biller.email} ${Biller.phone} ${Biller.company}`
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
        <SearchInput search={search} setSearch={setSearch} />
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