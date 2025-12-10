import React, { useState, useMemo } from 'react';
import { usePos } from '../../hooks/usePos';
import { useUI } from "../ListComponents/useUI";
import { selectColumn, indexColumn, imageColumn, statusColumn, actionsColumn } from '../ListComponents/columnHelpers';

// Reusable components
import ListContainer from '../ListComponents/ListContainer';
import ListHeader from '../ListComponents/ListHeader';
import ListControlButtons from '../ListComponents/ListControlButtons';
import ListFilter from '../ListComponents/ListFilter';
import ListTable from '../ListComponents/ListTable';
import ListPagination from '../ListComponents/ListPagination';
import SearchInput from '../ListComponents/SearchInput';
import SelectFilters from '../ListComponents/SelectFilters';

export default function BrandList({ brands = [], setShowForm }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [rowSelection, setRowSelection] = useState({});
  const { currentUser } = usePos();
  
  // Status options
  const statusOptions = useMemo(() => ['All', 'Active', 'Inactive'], []);

  // Columns configuration using helpers
  const columns = [
    selectColumn(),
    indexColumn(),
    imageColumn('name', 'Brand', 'image'),
    {
      id: 'created_by',
      accessorFn: row => row.createdBy ?? row.created_by ?? 'Unknown',
      header: 'Created By',
      size: 140,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created Date',
      size: 120,
    },
    statusColumn('status', 'Status'),
    actionsColumn(['edit', 'delete'])
  ];

  // Filtered data
  const filteredData = useMemo(() => {
    return brands.filter(brand => 
      (statusFilter === 'All' || brand.status === statusFilter) &&
      brand.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [brands, search, statusFilter]);

  // Use UI hook
  const {
    table,
    controlButtons,
    primaryButtons,
    emptyState
  } = useUI({
    moduleName: 'brands',
    filteredData,
    columns,
    rowSelection,
    setRowSelection,
    onAddItem: () => setShowForm(true),
    isAddDisabled: currentUser.role !== 'admin',
    resetFilters: () => {
      setSearch('');
      setStatusFilter('All');
      setRowSelection({});
    }
  });

  return (
    <ListContainer>
      <ListHeader 
        title="Brands"
        description="Manage your brands"
        controlButtons={<ListControlButtons buttons={controlButtons} />}
        primaryButtons={primaryButtons.map((btn, i) => (
          <React.Fragment key={i}>{btn.element}</React.Fragment>
        ))}
      />
      
      <ListFilter>
        <SearchInput search={search} setSearch={setSearch} placeholder="Search brands..." />
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