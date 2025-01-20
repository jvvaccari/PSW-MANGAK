// src/pages/MangaAdminPage.jsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

// Thunks from your mangaSlice
import {
  loadMangas,
  createMangaThunk,
  updateMangaThunk,
  deleteMangaThunk,
} from "../redux/mangaSlice";

// If you want color theme or extra services
// import { fetchMangas, createManga, updateManga, deleteManga } from "../../services/api";

function MangaAdminPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { mangas, loading, error } = useSelector((state) => state.manga);

  // Local UI state
  const [editingRow, setEditingRow] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch mangas on mount
  useEffect(() => {
    // only load if not yet loaded
    if (mangas.length === 0) {
      dispatch(loadMangas());
    }
  }, [dispatch, mangas.length]);

  // field change helpers
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value.split(",").map((v) => v.trim()),
    }));
  };

  // Save (create or update)
  const handleSaveClick = async () => {
    try {
      if (isCreating) {
        // CREATE
        const newManga = { ...formData, id: `${Date.now()}` };
        dispatch(createMangaThunk(newManga));
      } else if (editingRow) {
        // UPDATE
        dispatch(
          updateMangaThunk({
            id: editingRow.id,
            mangaData: {
              ...formData,
              // convert any comma-strings back to arrays if needed
            },
          })
        );
      }
      // Reset form state
      setEditingRow(null);
      setIsCreating(false);
      setFormData({});
    } catch (error) {
      console.error("Erro ao salvar mangá:", error);
    }
  };

  // Edit
  const handleEditClick = (row) => {
    setEditingRow(row);
    setIsCreating(false);
    setFormData({
      ...row,
      genres: row.genres?.join(", "),
      artsList: row.artsList?.join(", "),
    });
  };

  // Delete
  const handleDeleteClick = (id) => {
    dispatch(deleteMangaThunk(id));
  };

  // Cancel
  const handleCancelClick = () => {
    setEditingRow(null);
    setIsCreating(false);
    setFormData({});
  };

  // Table columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Título", width: 200 },
    { field: "author", headerName: "Autor", width: 150 },
    { field: "yearPubli", headerName: "Ano", width: 100 },
    { field: "status", headerName: "Status", width: 150 },
    {
      field: "actions",
      headerName: "Ações",
      width: 200,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditClick(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  // Fields for editing/creating
  const formFields = [
    { label: "Título", field: "title" },
    { label: "Autor", field: "author" },
    { label: "Descrição", field: "description" },
    { label: "Ano de Publicação", field: "yearPubli" },
    { label: "Status", field: "status" },
    { label: "Demografia", field: "demographic" },
    {
      label: "Gêneros (separados por vírgulas)",
      field: "genres",
      isArray: true,
    },
    {
      label: "Lista de Artes (URLs separadas por vírgulas)",
      field: "artsList",
      isArray: true,
    },
    { label: "Imagem", field: "image" },
  ];

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#1E1E1E",
        minHeight: "100vh",
        color: "#FFF",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: "#FFF" }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ marginLeft: "10px" }}>
          Administração de Mangás
        </Typography>
      </Box>

      {/* Create new manga button */}
      <Button
        onClick={() => {
          setIsCreating(true);
          setEditingRow(null);
          setFormData({});
        }}
        variant="contained"
        sx={{ backgroundColor: "#FF0037", marginBottom: "20px" }}
      >
        Adicionar Novo Mangá
      </Button>

      {/* Show loading or error */}
      {loading && <Typography>Carregando mangás...</Typography>}
      {error && <Typography color="error">Erro: {error}</Typography>}

      {/* DataGrid Table */}
      <DataGrid
        rows={mangas}
        columns={columns}
        pageSize={5}
        sx={{
          height: 400,
          backgroundColor: "#2C2C2C",
          color: "#FFF",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#333",
            color: "#000",
            fontSize: "16px",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-cell": {
            color: "#FFF",
          },
        }}
      />

      {/* Edit/Create Form */}
      {(editingRow || isCreating) && (
        <Box
          sx={{
            marginTop: "20px",
            backgroundColor: "#333",
            padding: "20px",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "2em",
          }}
        >
          <Typography variant="h6">
            {isCreating ? "Adicionar Novo Mangá" : "Editar Mangá"}
          </Typography>
          {formFields.map(({ label, field, isArray }) => (
            <TextField
              key={field}
              label={label}
              value={formData[field] || ""}
              onChange={(e) =>
                isArray
                  ? handleArrayFieldChange(field, e.target.value)
                  : handleFieldChange(field, e.target.value)
              }
              fullWidth
              sx={{
                marginBottom: "10px",
                "& .MuiInputBase-root": {
                  color: "#FFFFFF",
                },
                "& .MuiInputLabel-root": {
                  color: "#A5A5A5",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#FFFFFF",
                  },
                  "&:hover fieldset": {
                    borderColor: "#FF0037",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FF0037",
                  },
                },
              }}
            />
          ))}
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Button
              onClick={handleSaveClick}
              variant="contained"
              sx={{ backgroundColor: "#FF0037" }}
            >
              Salvar
            </Button>
            <Button
              onClick={handleCancelClick}
              variant="outlined"
              sx={{
                color: "#FF0037",
                borderColor: "#FF0037",
                "&:hover": {
                  backgroundColor: "#FF003780",
                  color: "#FFF",
                },
              }}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default MangaAdminPage;
