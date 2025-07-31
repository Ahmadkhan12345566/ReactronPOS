import React, { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ActionMenu = ({ row }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => { handleClose(); alert(`Viewing purchase ${row.id}`); }}>
          <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); alert(`Editing purchase ${row.id}`); }}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); alert(`Deleting purchase ${row.id}`); }}>
          <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "date", headerName: "Date", width: 120 },
  { field: "supplier", headerName: "Supplier", flex: 1 },
  {
    field: "total",
    headerName: "Total (Rs.)",
    width: 140,
   valueFormatter: ({ value }) =>
    typeof value === "number" ? `Rs. ${value.toLocaleString()}` : "Rs. 0",
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 100,
    sortable: false,
    renderCell: (params) => <ActionMenu row={params.row} />,
  },
];

const dummyPurchases = [
  { id: 1, date: "2024-07-29", supplier: "ABC Supplies", total: 5000 },
  { id: 2, date: "2024-07-28", supplier: "XYZ Traders", total: 3400 },
  { id: 3, date: "2024-07-27", supplier: "Global Mart", total: 2120 },
];

const PurchaseList = ({ onAddPurchase }) => {
  const [search, setSearch] = useState("");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return dummyPurchases.filter((p) =>
      [p.supplier, p.date, p.total].join(" ").toLowerCase().includes(q)
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / paginationModel.pageSize));

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Purchase List</h2>
       
      </div>

      <input
        type="text"
        placeholder="Search purchases..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPaginationModel((prev) => ({ ...prev, page: 0 }));
        }}
        className="w-full p-2 border border-gray-300 rounded"
      />

      <DataGrid
        rows={filtered}
        columns={columns}
        autoHeight
        pagination
        pageSizeOptions={[5, 10, 25]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        disableRowSelectionOnClick
      />

      <div className="text-right text-sm text-gray-500">
        Page {paginationModel.page + 1} of {totalPages}
      </div>
    </div>
  );
};

export default PurchaseList;
