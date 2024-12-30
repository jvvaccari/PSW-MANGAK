import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  fetchAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../../services/api";
import { useNavigate } from "react-router-dom";

const AuthorAdminPage = () => {
  const [authors, setAuthors] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadAuthors = async () => {
      try {
        const data = await fetchAuthors();
        setAuthors(data);
      } catch (error) {
        console.error("Erro ao carregar autores:", error);
      }
    };
    loadAuthors();
  }, []);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value.split(",").map((v) => v.trim()),
    }));
  };

  const validateForm = () => {
    const requiredFields = ["name", "pseudonym", "birthDate", "biography"];
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        return false;
      }
    }
    return true;
  };

  const handleSaveClick = async () => {
    if (!validateForm()) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    try {
      if (isCreating) {
        const newAuthor = { ...formData, id: `${Date.now()}` };
        const createdAuthor = await createAuthor(newAuthor);
        setAuthors((prev) => [...prev, createdAuthor]);
      } else if (editingRow) {
        const updatedAuthor = await updateAuthor(editingRow.id, formData);
        setAuthors((prev) =>
          prev.map((a) => (a.id === editingRow.id ? updatedAuthor : a))
        );
      }
      setEditingRow(null);
      setIsCreating(false);
      setFormData({});
    } catch (error) {
      console.error("Erro ao salvar autor:", error);
    }
  };

  const handleEditClick = (row) => {
    setEditingRow(row);
    setFormData({ ...row });
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteAuthor(id);
      setAuthors((prev) => prev.filter((author) => author.id !== id));
    } catch (error) {
      console.error("Erro ao excluir autor:", error);
    }
  };

  const handleCancelClick = () => {
    setEditingRow(null);
    setIsCreating(false);
    setFormData({});
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Nome", width: 200 },
    { field: "pseudonym", headerName: "Pseudônimo", width: 200 },
    { field: "birthDate", headerName: "Data de Nascimento", width: 150 },
    { field: "birthPlace", headerName: "Local de Nascimento", width: 200 },
    { field: "nationality", headerName: "Nacionalidade", width: 150 },
    { field: "ethnicity", headerName: "Etnia", width: 150 },
    {
      field: "occupations",
      headerName: "Ocupações",
      width: 200,
      renderCell: (params) => params.value?.join(", "),
    },
    {
      field: "notableWorks",
      headerName: "Trabalhos Notáveis",
      width: 200,
      renderCell: (params) => params.value?.join(", "),
    },
    {
      field: "authorPhoto",
      headerName: "Foto",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Foto do Autor"
          style={{ width: "50px", height: "50px", borderRadius: "4px" }}
        />
      ),
    },
    {
      field: "biography",
      headerName: "Biografia",
      width: 300,
      renderCell: (params) => (
        <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          {params.value}
        </div>
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
  

  const formFields = [
    { label: "Nome", field: "name" },
    { label: "Pseudônimo", field: "pseudonym" },
    { label: "Data de Nascimento", field: "birthDate" },
    { label: "Lugar de Nascimento", field: "birthPlace" },
    { label: "Nacionalidade", field: "nationality" },
    { label: "Etnia", field: "ethnicity" },
    {
      label: "Ocupações (separadas por vírgulas)",
      field: "occupations",
      isArray: true,
    },
    {
      label: "Trabalhos Notáveis (separados por vírgulas)",
      field: "notableWorks",
      isArray: true,
    },
    { label: "Biografia", field: "biography" },
    { label: "Foto (URL)", field: "authorPhoto" },
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
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: "#FFF" }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ marginLeft: "10px" }}>
          Administração de Autores
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
        Adicionar Novo Autor
      </Button>

      <DataGrid
  rows={authors}
  columns={columns}
  pageSize={5}
  sx={{
    height: 400,
    backgroundColor: "#2C2C2C",
    color: "#FFF",
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#333", // Cor de fundo do header
      color: "#FFF", // Cor do texto do header
      fontSize: "16px", // Tamanho do texto
      fontWeight: "bold", // Texto em negrito
    },
    "& .MuiDataGrid-cell": {
      color: "#FFF",
    },
  }}
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
            {isCreating ? "Adicionar Novo Autor" : "Editar Autor"}
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
};

export default AuthorAdminPage;
