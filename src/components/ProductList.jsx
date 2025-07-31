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

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Product Name", flex: 1 },
  { field: "price", headerName: "Price ($)", width: 120 },
  { field: "code", headerName: "Product Code", flex: 1 },
  {
    field: "actions",
    headerName: "Actions",
    width: 100,
    sortable: false,
    renderCell: (params) => <ActionMenu row={params.row} />,
  },
];

// Action Dropdown Component
function ActionMenu({ row }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => { handleClose(); alert(`Viewing ${row.name}`); }}>
          <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); alert(`Editing ${row.name}`); }}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); alert(`Deleting ${row.name}`); }}>
          <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default function ProductList({ products }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return products.filter((p) =>
      [p.name, p.code, String(p.price)].join(" ").toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / paginationModel.pageSize));

  return (
    <div style={{ width: "100%" }}>
      {/* Global Search */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPaginationModel((m) => ({ ...m, page: 0 }));
          }}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

      <DataGrid
        rows={filtered}
        columns={columns}
        pagination
        autoHeight
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => setPaginationModel(model)}
        disableSelectionOnClick
      />

      <div className="mt-2 text-sm text-gray-600 text-right">
        Page {paginationModel.page + 1} of {totalPages}
      </div>
    </div>
  );
}
