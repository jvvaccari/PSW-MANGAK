import { useContext, useState } from "react";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { updateManga, createManga } from "../../services/api";
import MangaContext from "../contexts/MangaContext";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const { mangas, setMangas } = useContext(MangaContext);
  const [editingRow, setEditingRow] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = async () => {
    try {
      if (isCreating) {
        const newManga = { ...formData, id: `${mangas.length + 1}` };
        await createManga(newManga);
        setMangas((prev) => [...prev, newManga]);
      } else if (editingRow) {
        await updateManga(editingRow.id, formData);
        setMangas((prev) =>
          prev.map((m) => (m.id === editingRow.id ? { ...formData } : m))
        );
      }
      setEditingRow(null);
      setIsCreating(false);
      setFormData({});
    } catch (error) {
      console.error("Erro ao salvar manga:", error);
    }
  };

  const handleEditClick = (row) => {
    setEditingRow(row);
    setFormData(row);
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
      width: 150,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleEditClick(params.row)}
          sx={{ color: "var(--btn-mangak-color)" }}
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box
      sx={{
        padding: "var(--spacing-large)",
        backgroundColor: "var(--bg-page-color)",
        minHeight: "100vh",
        color: "var(--text-color)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-large)",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ color: "#fff",padding: "0px" }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Typography
          variant="h4"
          sx={{
            fontFamily: "var(--font-title)",
            color: "var(--text-color)",
          }}
        >
          Administração de Mangás
        </Typography>

      {/* Botão Adicionar */}
      <Button
        onClick={() => {
          setIsCreating(true);
          setFormData({});
        }}
        variant="contained"
        color="primary"
        startIcon={<AddCircleOutlineIcon />}
        sx={{
          backgroundColor: "var(--btn-mangak-color)",
          alignSelf: "flex-start",
          "&:hover": {
            backgroundColor: "#CC002A",
          },
        }}
      >
        Adicionar Novo Mangá
      </Button>

      {/* Tabela */}
      <DataGrid
        rows={mangas}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        autoHeight
        sx={{
          backgroundColor: "var(--bg-data-color)",
          color: "var(--text-color)",
          "& .MuiDataGrid-cell": {
            borderColor: "#fff",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundImage:
              "linear-gradient(to right, rgba(255, 0, 0, 0.2), rgba(255, 0, 0, 0.1))",
          },
          "& .Mui-selected": {
            backgroundImage:
              "linear-gradient(to right, rgba(255, 0, 0, 0.4), rgba(255, 0, 0, 0.2)) !important",
            color: "#fff",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#fff",
            color: "var(--bg-page-color)",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
        }}
      />

      {/* Formulário de Edição/Criação */}
      {(editingRow || isCreating) && (
        <Box
          sx={{
            marginTop: "var(--spacing-large)",
            border: "1px solid #fff",
            backgroundColor: "#1E1E1E",
            padding: "var(--spacing-medium)",
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontFamily: "var(--font-title)",
              color: "var(--text-color)",
            }}
          >
            {isCreating ? "Adicionar Novo Mangá" : "Editar Mangá"}
          </Typography>
          {[
            { label: "Título", field: "title" },
            { label: "Autor", field: "author" },
            { label: "Descrição", field: "description" },
            { label: "Ano de Publicação", field: "yearPubli" },
            { label: "Status", field: "status" },
            { label: "Demografia", field: "demographic" },
            { label: "Gêneros (separados por vírgula)", field: "genres" },
            { label: "URL da Imagem", field: "image" },
            { label: "Links de Artes (separados por vírgula)", field: "artsList" },
          ].map(({ label, field }) => (
            <TextField
              key={field}
              label={label}
              value={formData[field] || ""}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              fullWidth
              margin="normal"
              size="small"
              sx={{
                margin: "24px 0",
                "& .MuiInputBase-root": {
                  bgcolor: "#1E1E1E",
                  color: "#FFFFFF",
                },
                "& .MuiOutlinedInput-root": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FFFFFF",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FFFFFF",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FF0037",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#FFFFFF",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#FF0037",
                },
              }}
            />
          ))}
          <Box sx={{ marginTop: "var(--spacing-medium)", display: "flex", gap: "8px" }}>
            <Button
              onClick={handleSaveClick}
              variant="contained"
              sx={{
                backgroundColor: "var(--btn-mangak-color)",
                "&:hover": { backgroundColor: "#CC002A" },
              }}
            >
              Salvar
            </Button>
            <Button
              onClick={handleCancelClick}
              variant="outlined"
              sx={{
                color: "var(--text-color)",
                borderColor: "var(--btn-mangak-color)",
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

export default AdminPage;