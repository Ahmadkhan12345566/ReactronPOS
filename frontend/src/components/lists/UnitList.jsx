import React, { useState, useMemo } from 'react';
import { usePos } from '../../hooks/usePos';
import { useUI } from "../ListComponents/useUI";
import { 
  selectColumn, 
  indexColumn, 
  statusColumn,
  actionsColumn
} from '../ListComponents/columnHelpers';
import { api } from '../../services/api';
import EditUnitForm from '../forms/EditUnitForm';

// Reusable components
import ListContainer from '../ListComponents/ListContainer';
import ListHeader from '../ListComponents/ListHeader';
import ListControlButtons from '../ListComponents/ListControlButtons';
import ListFilter from '../ListComponents/ListFilter';
import ListTable from '../ListComponents/ListTable';
import ListPagination from '../ListComponents/ListPagination';
import SearchInput from '../ListComponents/SearchInput';
import SelectFilters from '../ListComponents/SelectFilters';

export default function UnitList({ units = [], setShowForm, onRefresh }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [rowSelection, setRowSelection] = useState({});
  const { currentUser } = usePos();
  const isAdmin = currentUser?.role === 'admin';


 
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
    actionsColumn(['edit', 'delete'], 120, {
      isActionDisabled: (action) => !isAdmin && (action === 'edit' || action === 'delete'),
    })
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
  const handleDelete = async (unit) => {
    try {
      await api.delete(`/api/units/${unit.id}`);
      if (typeof onRefresh === 'function') {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting unit:', error);
    }
  };

  const actionRenderers = {
    edit: ({ data, onClose }) => (
      <EditUnitForm unit={data} onSaved={onRefresh} onCancel={onClose} />
    ),
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
    isAddDisabled: !isAdmin,
    onRefresh,
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
        actionRenderers={actionRenderers}
      />
      
      <ListPagination 
        table={table} 
        dataLength={filteredData.length} 
      />
    </ListContainer>
  );
}
