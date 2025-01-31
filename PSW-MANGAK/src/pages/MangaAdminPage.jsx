import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import * as api from "../../services/api";

function MangaAdminPage() {
  const navigate = useNavigate();
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const mangaData = await api.fetchMangas();
        setMangas(mangaData);
        const authorData = await api.fetchAuthors();
        setAuthors(authorData);
      } catch (err) {
        setError("Erro ao carregar dados.",err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refreshMangas = async () => {
    try {
      const data = await api.fetchMangas();
      setMangas(data);
    } catch (err) {
      setError("Erro ao atualizar a lista de mangás.",err);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value.split(",").map((v) => v.trim()),
    }));
  };

  const handleSaveClick = async () => {
    try {
      if (isCreating) {
        await api.createManga(formData);
      } else if (editingRow) {
        await api.updateManga(editingRow.id, formData);
      }
      await refreshMangas();
      setEditingRow(null);
      setIsCreating(false);
      setFormData({});
    } catch (err) {
      setError("Erro ao salvar o mangá.",err);
    }
  };

  const handleEditClick = (row) => {
    setEditingRow(row);
    setIsCreating(false);
    setFormData({
      ...row,
      genres: row.genres?.join(", "),
      artsList: row.artsList?.join(", "),
    });
  };

  const handleDeleteClick = async (id) => {
    try {
      await api.deleteManga(id);
      await refreshMangas();
    } catch (err) {
      setError("Erro ao excluir o mangá.",err);
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
    {
      field: "author",
      headerName: "Autor",
      width: 150,
      valueGetter: (params) => {
        const author = authors.find((a) => a._id === params.row.authorId);
        return author ? author.name : "Autor desconhecido";
      },
    },
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
    {
      label: "Autor",
      field: "authorId",
      isDropdown: true,
      options: authors.map((a) => ({ value: a._id, label: a.name })),
    },
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
    { label: "Imagem (URL)", field: "image" },
  ];

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#1E1E1E", minHeight: "100vh", color: "#FFF" }}>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: "#FFF" }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ marginLeft: "10px" }}>Administração de Mangás</Typography>
      </Box>

      <Button onClick={() => setIsCreating(true)} variant="contained" sx={{ backgroundColor: "#FF0037", marginBottom: "20px" }}>
        Adicionar Novo Mangá
      </Button>

      {loading && <Typography>Carregando mangás...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <DataGrid rows={mangas} columns={columns} pageSize={5} sx={{ height: 400, backgroundColor: "#2C2C2C", color: "#FFF" }} />

      {(editingRow || isCreating) && (
        <Box sx={{ marginTop: "20px", backgroundColor: "#333", padding: "20px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "2em" }}>
          <Typography variant="h6">{isCreating ? "Adicionar Novo Mangá" : "Editar Mangá"}</Typography>
          {formFields.map(({ label, field, isArray, isDropdown, options }) => (
            <TextField
              key={field}
              label={label}
              value={formData[field] || ""}
              onChange={(e) => isArray ? handleArrayFieldChange(field, e.target.value) : handleFieldChange(field, e.target.value)}
              fullWidth
              select={isDropdown}
              SelectProps={{ native: true }}
              sx={{
                marginBottom: "10px",
                "& .MuiInputBase-root": { color: "#FFFFFF" },
                "& .MuiInputLabel-root": { color: "#A5A5A5" },
                "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#FFFFFF" }, "&:hover fieldset": { borderColor: "#FF0037" } },
              }}
            >
              {isDropdown && options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </TextField>
          ))}
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Button onClick={handleSaveClick} variant="contained" sx={{ backgroundColor: "#FF0037" }}>Salvar</Button>
            <Button onClick={handleCancelClick} variant="outlined" sx={{ color: "#FF0037", borderColor: "#FF0037", "&:hover": { backgroundColor: "#FF003780", color: "#FFF" } }}>
              Cancelar
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default MangaAdminPage;
