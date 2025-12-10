import React, { useState, useMemo } from 'react';
import { useUI } from "../ListComponents/useUI";
import { selectColumn, indexColumn, statusColumn, actionsColumn } from '../ListComponents/columnHelpers';
import { usePos } from '../../hooks/usePos';

// Reusable components
import ListContainer from '../ListComponents/ListContainer';
import ListHeader from '../ListComponents/ListHeader';
import ListControlButtons from '../ListComponents/ListControlButtons';
import ListFilter from '../ListComponents/ListFilter';
import ListTable from '../ListComponents/ListTable';
import ListPagination from '../ListComponents/ListPagination';
import SearchInput from '../ListComponents/SearchInput';
import SelectFilters from '../ListComponents/SelectFilters';

export default function CategoryList({ categories = [], setShowForm }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [rowSelection, setRowSelection] = useState({});
  const { currentUser } = usePos();
  
  // Status options
  const statusOptions = useMemo(() => ['All', 'Active', 'Inactive'], []);

  // Format date function
  const formatDate = (dateValue) => {
    if (!dateValue) return '-';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Columns configuration using helpers
  const columns = [
    selectColumn(),
    indexColumn(),

    // Category name
    {
      accessorKey: 'name',
      header: 'Category',
      size: 150,
    },

    // Image (handles missing or empty urls)
    {
      id: 'image',
      accessorFn: row => row.image || row.icon || '',
      header: 'Image',
      size: 90,
      cell: ({ getValue }) => {
        const src = getValue();
        return src ? (
          <img src={src} alt="cat" className="w-10 h-10 object-cover rounded-md" />
        ) : <span className="text-xs text-gray-400">—</span>;
      }
    },

    // Status (keep your helper which renders badges / colors)
    statusColumn('status', 'Status'),

    // Created by: supports both createdBy and created_by
    {
      id: 'created_by',
      accessorFn: row => row.createdBy ?? row.created_by ?? row.created_by_name ?? row.creatorName ?? null,
      header: 'Created By',
      size: 140,
      cell: ({ getValue }) => getValue() || '-'
    },


    actionsColumn(['edit', 'delete'])
  ];

  // Filtered data
  const filteredData = useMemo(() => {
    return categories.filter(cat => 
      (statusFilter === 'All' || (cat.status ?? '').toString() === statusFilter) &&
      `${cat.name ?? ''}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search, statusFilter]);

  const {
    table,
    controlButtons,
    primaryButtons,
    emptyState
  } = useUI({
    moduleName: 'categories',
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
        title="Categories"
        description="Manage your categories"
        controlButtons={<ListControlButtons buttons={controlButtons} />}
        primaryButtons={primaryButtons.map((btn, i) => (
          <React.Fragment key={i}>{btn.element}</React.Fragment>
        ))}
      />
      
      <ListFilter>
        <SearchInput search={search} setSearch={setSearch} placeholder="Search categories..." />
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
