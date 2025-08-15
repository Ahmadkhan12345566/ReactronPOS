import React, { useState, useMemo } from 'react';
import { useUI } from "../ListComponents/useUI";
import { 
  selectColumn, 
  indexColumn, 
  statusColumn 
} from '../ListComponents/columnHelpers';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

// Reusable components
import ListContainer from '../ListComponents/ListContainer';
import ListHeader from '../ListComponents/ListHeader';
import ListControlButtons from '../ListComponents/ListControlButtons';
import ListFilter from '../ListComponents/ListFilter';
import ListTable from '../ListComponents/ListTable';
import ListPagination from '../ListComponents/ListPagination';
import SearchInput from '../ListComponents/SearchInput';
import SelectField from '../ListComponents/SelectField';

export default function UnitList({ units, setShowForm }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [rowSelection, setRowSelection] = useState({});

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
      accessorKey: 'shortName',
      header: 'Short Name',
      size: 120,
    },
    {
      accessorKey: 'productCount',
      header: 'No of Products',
      size: 120,
    },
    {
      accessorKey: 'createdOn',
      header: 'Created Date',
      size: 120,
    },
    statusColumn('status', 'Status'),
  {
    id: 'actions',
    header: 'Actions',
    cell: () => (
      <div className="flex space-x-1">
        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
          <PencilIcon className="w-5 h-5" />
        </button>
        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    ),
    size: 100,
  }
];

  // Filtered data
  const filteredData = useMemo(() => {
    return units.filter(unit => 
      (statusFilter === 'All' || unit.status === statusFilter) &&
      `${unit.name} ${unit.shortName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [units, search, statusFilter]);

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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-9">
            <SearchInput 
              search={search} 
              setSearch={setSearch} 
              placeholder="Search units..." 
            />
          </div>
          <div className="md:col-span-3">
            <SelectField
              name="status"
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
            />
          </div>
        </div>
      </ListFilter>
      
      <ListTable 
        table={table} 
        emptyState={emptyState}
        maxHeight="max-h-[calc(100vh-26rem)]"
      />
      
      <ListPagination 
        table={table} 
        dataLength={filteredData.length} 
      />
    </ListContainer>
  );
}