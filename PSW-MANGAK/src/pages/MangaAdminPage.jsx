import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import * as api from "../../services/api";
import { ErrorBoundary } from "react-error-boundary";
import PropTypes from "prop-types";

// Componente para exibir erros
function ErrorFallback({ error }) {
  return (
    <Box sx={{ color: "red", padding: "20px" }}>
      <Typography variant="h6">Algo deu errado:</Typography>
      <Typography>{error.message}</Typography>
    </Box>
  );
}

function MangaAdminPage() {
  const navigate = useNavigate();
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const [authors, setAuthors] = useState([]);

  // Carrega mangás e autores
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const mangaData = await api.fetchMangas();
        const mangasWithId = mangaData.map((manga) => ({
          ...manga,
          id: manga._id || `${Date.now()}`, // Garante um ID válido
        }));
        setMangas(mangasWithId);

        const authorData = await api.fetchAuthors();
        setAuthors(authorData);
      } catch (err) {
        setError("Erro ao carregar dados.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Atualiza a lista de mangás
  const refreshMangas = async () => {
    try {
      const data = await api.fetchMangas();
      const mangasWithId = data.map((manga) => ({
        ...manga,
        id: manga._id || `${Date.now()}`, // Garante um ID válido
      }));
      setMangas(mangasWithId);
    } catch (err) {
      setError("Erro ao atualizar a lista de mangás.");
      console.error(err);
    }
  };

  // Manipula mudanças nos campos do formulário
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Manipula campos de array (ex: gêneros, lista de artes)
  const handleArrayFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value.split(",").map((v) => v.trim()),
    }));
  };

  // Salva um mangá (criação ou edição)
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
      setError("Erro ao salvar o mangá.");
      console.error(err);
    }
  };

  // Edita um mangá
  const handleEditClick = (row) => {
    setEditingRow(row);
    setIsCreating(false);
    setFormData({
      ...row,
      genres: row.genres?.join(", "),
      artsList: row.artsList?.join(", "),
    });
  };

  // Exclui um mangá
  const handleDeleteClick = async (id) => {
    try {
      await api.deleteManga(id);
      await refreshMangas();
    } catch (err) {
      setError("Erro ao excluir o mangá.");
      console.error(err);
    }
  };

  // Cancela a edição ou criação
  const handleCancelClick = () => {
    setEditingRow(null);
    setIsCreating(false);
    setFormData({});
  };

  const columns = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "title", headerName: "Título", width: 200 },
    {
      field: "author",
      headerName: "Autor",
      width: 150,
      valueGetter: (params) => {
        if (!params || !params.row || !params.row.authorId)
          return "Autor desconhecido";
        const author = authors.find((a) => a._id === params.row.authorId);
        return author ? author.name : "Autor desconhecido";
      },
    },
    { field: "yearPubli", headerName: "Ano de Publicação", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "demographic", headerName: "Demografia", width: 150 },
    {
      field: "genres",
      headerName: "Gêneros",
      width: 200,
      renderCell: (params) => params.value?.join(", "),
    },
    {
      field: "artsList",
      headerName: "Lista de Artes",
      width: 200,
      renderCell: (params) => params.value?.join(", "),
    },
    {
      field: "image",
      headerName: "Imagem",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Capa do Mangá"
          style={{ width: "50px", height: "50px", borderRadius: "4px" }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditClick(params.row)}>
            <EditIcon sx={{ color: "#FFC107" }} />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(params.row.id)}>
            <DeleteIcon sx={{ color: "#FF0037" }} />
          </IconButton>
        </>
      ),
    },
  ];
  // Campos do formulário
  const formFields = [
    { label: "Título", field: "title", required: true },
    {
      label: "Autor",
      field: "authorId",
      isDropdown: true,
      options: authors.map((a) => ({ value: a._id, label: a.name })),
      required: true,
    },
    { label: "Descrição", field: "description", required: true },
    { label: "Ano de Publicação", field: "yearPubli", required: true },
    { label: "Status", field: "status", required: true },
    { label: "Demografia", field: "demographic", required: true },
    {
      label: "Gêneros (separados por vírgulas)",
      field: "genres",
      isArray: true,
      required: true,
    },
    {
      label: "Lista de Artes (URLs separadas por vírgulas)",
      field: "artsList",
      isArray: true,
      required: true,
    },
    { label: "Imagem (URL)", field: "image", required: true },
  ];

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Box
        sx={{
          padding: "20px",
          backgroundColor: "#1E1E1E",
          minHeight: "100vh",
          color: "#FFF",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
        >
          <IconButton onClick={() => navigate(-1)} sx={{ color: "#FFF" }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ marginLeft: "10px" }}>
            Administração de Mangás
          </Typography>
        </Box>

        <Button
          onClick={() => setIsCreating(true)}
          variant="contained"
          sx={{ backgroundColor: "#FF0037", marginBottom: "20px" }}
        >
          Adicionar Novo Mangá
        </Button>

        {loading && <CircularProgress sx={{ color: "#FFF" }} />}
        {error && <Typography color="error">{error}</Typography>}

        {!loading && (
          <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={mangas}
              columns={columns}
              pageSize={5}
              getRowId={(row) => row.id}
              sx={{
                backgroundColor: "#2C2C2C",
                color: "#FFF",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#333",
                  color: "#000", // Cor do texto dos cabeçalhos
                  fontSize: "16px",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-cell": {
                  color: "#FFF",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold", // Deixa o texto dos cabeçalhos em negrito
                },
              }}
            />
          </Box>
        )}

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
            {formFields.map(
              ({ label, field, isArray, isDropdown, options }) => (
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
                  select={isDropdown}
                  SelectProps={{ native: true }}
                  sx={{
                    marginBottom: "10px",
                    "& .MuiInputBase-root": { color: "#FFF" },
                    "& .MuiInputLabel-root": { color: "#A5A5A5" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#FFF" },
                      "&:hover fieldset": { borderColor: "#FF0037" },
                    },
                  }}
                >
                  {isDropdown &&
                    options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                </TextField>
              )
            )}
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
                  "&:hover": { backgroundColor: "#FF003780", color: "#FFF" },
                }}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </ErrorBoundary>
  );
}
ErrorFallback.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired, // Valida que `error.message` é uma string obrigatória
  }).isRequired, // Valida que `error` é um objeto obrigatório
};

export default MangaAdminPage;
