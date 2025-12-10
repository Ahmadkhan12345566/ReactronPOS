import React, { useState, useMemo } from 'react';
import { usePos } from '../../hooks/usePos';
import { useUI } from "../ListComponents/useUI";
import { useEffect } from 'react';
import { 
  selectColumn, 
  indexColumn, 
  statusColumn,
  actionsColumn
} from '../ListComponents/columnHelpers';
import { api } from '../../services/api';

// Reusable components
import ListContainer from '../ListComponents/ListContainer';
import ListHeader from '../ListComponents/ListHeader';
import ListControlButtons from '../ListComponents/ListControlButtons';
import ListFilter from '../ListComponents/ListFilter';
import ListTable from '../ListComponents/ListTable';
import ListPagination from '../ListComponents/ListPagination';
import SearchInput from '../ListComponents/SearchInput';
import SelectFilters from '../ListComponents/SelectFilters';

export default function UnitList({ units = [], setShowForm }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [rowSelection, setRowSelection] = useState({});
  const { currentUser } = usePos();


 
  // Status options
  const statusOptions = useMemo(() => ['All', 'Active', 'Inactive'], []);

  // Columns using helpers
  const columns = [
    selectColumn(),
    indexColumn(),
    {
      accessorKey: 'name',
      header: 'Unit',
      size: 150,
    },
    {
      accessorKey: 'short_name',
      header: 'Short Name',
      size: 120,
    },
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
    return units.filter(unit => 
      (statusFilter === 'All' || unit.status === statusFilter) &&
      `${unit.name} ${unit.short_name}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [units, search, statusFilter]);
   useEffect(() => {
  filteredData.forEach(unit => {
    console.log(unit);
  });
}, [filteredData]);

  const handleDelete = async (unit) => {
    try {
      await api.delete(`/api/units/${unit.id}`);
      // You might want to refresh the list of units here
    } catch (error) {
      console.error('Error deleting unit:', error);
    }
  };

  const handleEdit = async (unit) => {
    // For now, just log the edited unit.
    // You might want to refresh the list of units here
    console.log('Edited unit:', unit);
  };

  // Use UI hook
  const {
    table,
    controlButtons,
    primaryButtons,
    emptyState
  } = useUI({
    moduleName: 'units',
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
        title="Units"
        description="Manage your units"
        controlButtons={<ListControlButtons buttons={controlButtons} />}
        primaryButtons={primaryButtons.map((btn, i) => (
          <React.Fragment key={i}>{btn.element}</React.Fragment>
        ))}
      />
      
      <ListFilter>
        <SearchInput search={search} setSearch={setSearch} placeholder="Search units..." />
        <SelectFilters 
          statusFilter={statusFilter} 
          setStatusFilter={setStatusFilter} 
          statusOptions={statusOptions} 
        />
      </ListFilter>
      
      <ListTable 
        table={table} 
        emptyState={emptyState}
        maxHeight="max-h-[calc(100vh-26rem)]"
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
      
      <ListPagination 
        table={table} 
        dataLength={filteredData.length} 
      />
    </ListContainer>
  );
}