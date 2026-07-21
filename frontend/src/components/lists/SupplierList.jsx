import React, { useState, useMemo } from 'react';
import { usePos } from '../../hooks/usePos';
import { useUI } from "../ListComponents/useUI";
import {
  selectColumn,
  statusColumn,
  actionsColumn
} from '../ListComponents/columnHelpers';
import { api } from '../../services/api';
import EditSupplierForm from '../forms/EditSupplierForm';

// Reusable components
import ListContainer from '../ListComponents/ListContainer';
import ListHeader from '../ListComponents/ListHeader';
import ListControlButtons from '../ListComponents/ListControlButtons';
import ListFilter from '../ListComponents/ListFilter';
import ListTable from '../ListComponents/ListTable';
import ListPagination from '../ListComponents/ListPagination';
import SearchInput from '../ListComponents/SearchInput';
import SelectFilters from '../ListComponents/SelectFilters';

export default function SupplierList({ suppliers = [], setShowForm, onRefresh }) {
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
    {
      id: 'image',
      accessorFn: row => row.image || row.icon || '',
      header: 'Image',
      size: 90,
      cell: ({ getValue }) => {
        const src = getValue();
        return src ? (
          <img src={src} alt="supplier" className="w-10 h-10 object-cover rounded-md" />
        ) : (
          <span className="text-xs text-gray-400">--</span>
        );
      }
    },
    {
      accessorKey: 'name',
      header: 'Name',
      size: 150,
    },
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
      accessorKey: 'address',
      header: 'Address',
      size: 200,
    },
    statusColumn('status', 'Status'),
    actionsColumn(['view', 'edit', 'delete'], 120, {
      isActionDisabled: (action) => !isAdmin && (action === 'edit' || action === 'delete'),
    })
  ];

  // Filtered data
  const filteredData = useMemo(() => {
    return suppliers.filter(supplier => 
      (statusFilter === 'All' || supplier.status === statusFilter) &&
      `${supplier.name || ''} ${supplier.email || ''} ${supplier.phone || ''} ${supplier.address || ''}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [suppliers, search, statusFilter]);

  const handleDelete = async (supplier) => {
    try {
      await api.delete(`/api/suppliers/${supplier.id}`);
      if (typeof onRefresh === 'function') {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const actionRenderers = {
    edit: ({ data, onClose }) => (
      <EditSupplierForm supplier={data} onSaved={onRefresh} onCancel={onClose} />
    ),
  };

  // Use UI hook
  const {
    table,
    controlButtons,
    primaryButtons,
    emptyState
  } = useUI({
    moduleName: 'suppliers',
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
        title="Suppliers"
        description="Manage your suppliers"
        controlButtons={<ListControlButtons buttons={controlButtons} />}
        primaryButtons={primaryButtons.map((btn, i) => (
          <React.Fragment key={i}>{btn.element}</React.Fragment>
        ))}
      />

      <ListFilter>
        <SearchInput search={search} setSearch={setSearch} placeholder="Search suppliers..." />
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
