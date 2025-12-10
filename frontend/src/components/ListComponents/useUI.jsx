import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import LoopIcon from '@mui/icons-material/Loop';
import { exportToPDF, exportToExcel } from './exportFunctions';



export const useUI = ({
  moduleName = 'purchases',
  filteredData,
  columns,
  rowSelection,
  setRowSelection,
  onAddItem = false,
  isAddDisabled = false,
  onImportItem = false,
  onSortToggle,
  resetFilters
}) => {
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const controlButtons = [
    {
      icon: <img src="assets/icons/pdf.svg" alt="pdf" className="w-5 h-5" />,
      onClick: () => exportToPDF(filteredData, moduleName),
      title: 'Export to PDF',
    },
    {
      icon: <img src="assets/icons/excel.svg" alt="excel" className="w-5 h-5" />,
      onClick: () => exportToExcel(filteredData, moduleName),
      title: 'Export to Excel',
    },
    {
      icon: <LoopIcon className="w-5 h-5" />,
      onClick: () => window.location.reload(),
      title: 'Refresh',
    },
    {
      icon: <ChevronUpIcon className="w-5 h-5" />,
      onClick: onSortToggle || (() => {}),
      title: 'Collapse',
    },
  ];

  // Build primary buttons conditionally
  const primaryButtons = [];

  if (typeof onImportItem === 'function') {
    primaryButtons.push(
      {
        element: (
          <button
            key="import"
            onClick={onImportItem}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Import
          </button>
        )
      }
    );
  }

  if (typeof onAddItem === 'function') {
    primaryButtons.push(
      {
        element: (
          <button
            key="add"
            onClick={onAddItem}
            disabled={isAddDisabled}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add {moduleName.slice(0, 1).toUpperCase() + moduleName.slice(1).toLowerCase()}
          </button>
        )
      }
    );
  }

  const emptyState = (
    <div className="text-center py-8">
      <div className="text-gray-500">No {moduleName} found</div>
      <button
        className="mt-2 text-blue-600 hover:text-blue-800"
        onClick={resetFilters}
      >
        Clear filters
      </button>
    </div>
  );

  return {
    table,
    controlButtons,
    primaryButtons,
    emptyState,
  };
};
