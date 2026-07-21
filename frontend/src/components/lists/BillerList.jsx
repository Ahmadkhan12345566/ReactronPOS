import React, { useState, useMemo } from 'react';
import { useUI } from "../ListComponents/useUI";
import { selectColumn, statusColumn, actionsColumn } from '../ListComponents/columnHelpers';
import { api } from '../../services/api';
import EditBillerForm from '../forms/EditBillerForm';

// Reusable components
import ListContainer from '../ListComponents/ListContainer';
import ListHeader from '../ListComponents/ListHeader';
import ListControlButtons from '../ListComponents/ListControlButtons';
import ListFilter from '../ListComponents/ListFilter';
import ListTable from '../ListComponents/ListTable';
import ListPagination from '../ListComponents/ListPagination';
import SearchInput from '../ListComponents/SearchInput';
import SelectFilters from '../ListComponents/SelectFilters';

export default function BillerList({ billers = [], setShowForm, onRefresh }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [rowSelection, setRowSelection] = useState({});

  // Status options
  const statusOptions = useMemo(() => ['All', 'Active', 'Inactive'], []);

  // Columns aligned with User model fields.
  const columns = [
    selectColumn(),
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      size: 150,
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: 'Email',
      size: 200,
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: 'Role',
      size: 120,
    },
    statusColumn('status', 'Status'),
    actionsColumn(['view', 'edit', 'delete'])
  ];

  // Filtered data - updated to match User model fields
  const filteredData = useMemo(() => {
    return billers.filter(biller => 
      (statusFilter === 'All' || biller.status === statusFilter) &&
      `${biller.name || ''} ${biller.email || ''} ${biller.role || ''}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [billers, search, statusFilter]);

  const handleDelete = async (biller) => {
    try {
      await api.delete(`/api/billers/${biller.id}`);
      if (typeof onRefresh === 'function') {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting biller:', error);
    }
  };

  const actionRenderers = {
    edit: ({ data, onClose }) => (
      <EditBillerForm biller={data} onSaved={onRefresh} onCancel={onClose} />
    ),
  };

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
