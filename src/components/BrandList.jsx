import React, { useState, useMemo } from 'react';
import { useUI } from "./lists/useUI";
import { selectColumn, indexColumn, imageColumn, statusColumn, actionsColumn } from './lists/columnHelpers';

// Reusable components
import ListContainer from './lists/ListContainer';
import ListHeader from './lists/ListHeader';
import ListControlButtons from './lists/ListControlButtons';
import ListFilter from './lists/ListFilter';
import ListTable from './lists/ListTable';
import ListPagination from './lists/ListPagination';
import SearchInput from './lists/SearchInput';
import SelectFilters from './lists/SelectFilters';

export default function BrandList({ brands, setShowForm }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [rowSelection, setRowSelection] = useState({});
  
  // Status options
  const statusOptions = useMemo(() => ['All', 'Active', 'Inactive'], []);

  // Columns configuration using helpers
  const columns = [
    selectColumn(),
    indexColumn(),
    imageColumn('name', 'Brand', 'image'),
    {
      accessorKey: 'createdOn',
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
//  return (
//   <ListContainer>
//     <ListHeader 
//       title="Billers"
//       description="Manage your billers"
//       controlButtons={<ListControlButtons buttons={} />}
//       primaryButtons={primaryButtons.map((btn, i) => (
//                 <React.Fragment key={i}>{btn.element}</React.Fragment>
//               ))}
//       />
//       <ListFilter>
//               <SearchInput setSearch={setSearch} />
//               <SelectFilters statusFilter={statusFilter} setStatusFilter={setStatusFilter} statusOptions={statusOptions} />
//       </ListFilter>
//     <ListTable 
//       table={table} 
//       emptyState={emptyState}
//       maxHeight={"max-h-[calc(100vh-26rem)]"}
//     />
    
//     <ListPagination 
//       table={table} 
//       dataLength={filteredData.length} 
//     />
//   </ListContainer>
// );