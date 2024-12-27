import { useContext, useState, useEffect } from "react";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { updateManga, createManga, deleteManga, fetchMangas } from "../../services/api";
import MangaContext from "../contexts/MangaContext";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const { mangas, setMangas } = useContext(MangaContext);
  const [editingRow, setEditingRow] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  // Buscar mangás ao carregar a página
  useEffect(() => {
    const loadMangas = async () => {
      try {
        const data = await fetchMangas();
        setMangas(data);
      } catch (error) {
        console.error("Erro ao carregar mangás:", error);
      }
    };
    loadMangas();
  }, [setMangas]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value.split(",").map((v) => v.trim()) }));
  };

  const handleSaveClick = async () => {
    try {
      if (isCreating) {
        const newManga = { ...formData, id: `${Date.now()}` };
        const createdManga = await createManga(newManga);
        setMangas((prev) => [...prev, createdManga]);
      } else if (editingRow) {
        const updatedManga = await updateManga(editingRow.id, formData);
        setMangas((prev) =>
          prev.map((m) => (m.id === editingRow.id ? updatedManga : m))
        );
      }
      setEditingRow(null);
      setIsCreating(false);
      setFormData({});
    } catch (error) {
      console.error("Erro ao salvar mangá:", error);
    }
  };

  const handleEditClick = (row) => {
    setEditingRow(row);
    setFormData({ ...row, genres: row.genres?.join(", "), artsList: row.artsList?.join(", ") });
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteManga(id);
      setMangas((prev) => prev.filter((manga) => manga.id !== id));
    } catch (error) {
      console.error("Erro ao excluir mangá:", error);
    }
  };

  const handleCancelClick = () => {
    setEditingRow(null);
    setIsCreating(false);
    setFormData({});
  };

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

  const formFields = [
    { label: "Título", field: "title" },
    { label: "Autor", field: "author" },
    { label: "Descrição", field: "description" },
    { label: "Ano de Publicação", field: "yearPubli" },
    { label: "Status", field: "status" },
    { label: "Demografia", field: "demographic" },
    { label: "Gêneros (separados por vírgulas)", field: "genres", isArray: true },
    { label: "Lista de Artes (URLs separadas por vírgulas)", field: "artsList", isArray: true },
    { label: "Imagem", field: "image" },
  ];

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#1E1E1E", minHeight: "100vh", color: "#FFF" }}>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: "#FFF" }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ marginLeft: "10px" }}>
          Administração de Mangás
        </Typography>
      </Box>

      <Button
        onClick={() => {
          setIsCreating(true);
          setFormData({});
        }}
        variant="contained"
        sx={{ backgroundColor: "#FF0037", marginBottom: "20px" }}
      >
        Adicionar Novo Mangá
      </Button>

      <DataGrid
        rows={mangas}
        columns={columns}
        pageSize={5}
        sx={{ height: 400, backgroundColor: "#2C2C2C", color: "#FFF" }}
      />

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
            <Button onClick={handleCancelClick} variant="outlined">
              Cancelar
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AdminPage;
