import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Import reusable components
import ListContainer from '../ListComponents/ListContainer';
import ListHeader from '../ListComponents/ListHeader';
import ListControlButtons from '../ListComponents/ListControlButtons';
import ListTable from '../ListComponents/ListTable';
import ListPagination from '../ListComponents/ListPagination';
import ListFilter from '../ListComponents/ListFilter';
import SearchInput from '../ListComponents/SearchInput';
import SelectFilters from '../ListComponents/SelectFilters';
import { useUI } from '../ListComponents/useUI';
import { 
  selectColumn, 
  indexColumn, 
  imageColumn,
  actionsColumn
} from '../ListComponents/columnHelpers';

import { usePos } from '../../hooks/usePos';
export default function ProductList({ products, setShowForm }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [rowSelection, setRowSelection] = useState({});
   const navigate = useNavigate();
   const { currentUser } = usePos();
  // Derive unique categories & brands
  const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);
  const brands = useMemo(() => ['All', ...new Set(products.map(p => p.brand))], [products]);

  // Columns configuration
const columns = [
  selectColumn(),
  indexColumn(),
  imageColumn('name', 'Product Name', 'image'),
  {
    accessorKey: 'category',
    header: 'Category',
    size: 100,
  },
  {
    accessorKey: 'brand',
    header: 'Brand',
    size: 100,
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ getValue }) => `PKR ${getValue()}`,
    size: 80,
  },
  {
    accessorKey: 'unit',
    header: 'Unit',
    size: 60,
  },
  {
    accessorKey: 'qty',
    header: 'Qty',
    size: 60,
  },
  {
    accessorKey: 'createdBy',
    header: 'Created By',
    size: 140,
    cell: ({ getValue }) => getValue() || 'Unknown'
  },
  // imageColumn('createdBy', 'Created By', 'createdByAvatar', 140),
  actionsColumn(['view', 'edit', 'delete'])
];

  // Filtered data
  const filteredData = useMemo(() => {
    return products.filter(p => 
      (categoryFilter === 'All' || p.category === categoryFilter) &&
      (brandFilter === 'All' || p.brand === brandFilter) &&
      `${p.code} ${p.name}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search, categoryFilter, brandFilter]);
  const {
  table,
  controlButtons,
  primaryButtons,
  emptyState,
} = useUI({
  moduleName: 'products',
  filteredData,
  columns,
  rowSelection,
  setRowSelection,
  onImportItem: () => setShowForm(true),
  onAddItem: () => navigate('/add-product'),
  isAddDisabled: currentUser.role !== 'admin',
  onSortToggle: () => console.log('Collapse clicked'),
  resetFilters: () => {
          setSearch('');
          setCategoryFilter('All');
          setBrandFilter('All');
          setRowSelection({});
        }
});

  return (
    <ListContainer>
      <ListHeader 
        title="Product List"
        description="Manage your products inventory"
        controlButtons={<ListControlButtons buttons={controlButtons} />}
        primaryButtons={primaryButtons.map((btn, i) => (
          <React.Fragment key={i}>{btn.element}</React.Fragment>
        ))}
      />
      
      <ListFilter>
      <SearchInput 
        search={search} 
        setSearch={setSearch} 
      />
      <SelectFilters 
        statusFilter={categoryFilter} 
        setStatusFilter={setCategoryFilter} 
        statusOptions={categories} 
        placeholder='Category'
      />
      <SelectFilters 
        statusFilter={brandFilter} 
        setStatusFilter={setBrandFilter} 
        statusOptions={brands} 
        placeholder='Brand'
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