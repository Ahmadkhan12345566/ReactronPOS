import React, { useState, useMemo } from 'react';
import { useUI } from "../ListComponents/useUI";
import { 
  selectColumn, 
  imageColumn, 
  statusColumn, 
  actionsColumn 
} from '../ListComponents/columnHelpers';

// Reusable components
import ListContainer from '../ListComponents/ListContainer';
import ListHeader from '../ListComponents/ListHeader';
import ListControlButtons from '../ListComponents/ListControlButtons';
import ListFilter from '../ListComponents/ListFilter';
import ListTable from '../ListComponents/ListTable';
import ListPagination from '../ListComponents/ListPagination';
import SearchInput from '../ListComponents/SearchInput';
import SelectField from '../ListComponents/SelectField';

export default function SupplierList({ Suppliers, setShowForm }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [rowSelection, setRowSelection] = useState({});
  
  // Status options
  const statusOptions = useMemo(() => ['All', 'Active', 'Inactive'], []);


  // Columns using helpers
  const columns = [
    selectColumn(),
    {
      accessorKey: 'code',
      header: 'Code',
      size: 100,
    },
    imageColumn('name', 'Supplier', 'avatar'),
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
      size: 120,
    },
    {
      accessorKey: 'products',
      header: 'Products',
      size: 120,
    },
    statusColumn('status', 'Status'),
  actionsColumn(['view', 'edit', 'delete'])
  ];

  // Filtered data
  const filteredData = useMemo(() => {
    return Suppliers.filter(Supplier => 
      (statusFilter === 'All' || Supplier.status === statusFilter) &&
      `${Supplier.name} ${Supplier.email} ${Supplier.phone} ${Supplier.address} ${Supplier.products}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [Suppliers, search, statusFilter]);

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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-9">
            <SearchInput 
              search={search} 
              setSearch={setSearch} 
              placeholder="Search suppliers..." 
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