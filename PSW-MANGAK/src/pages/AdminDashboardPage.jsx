import { useNavigate } from "react-router-dom";
import { Button, Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        color: "white",
        textAlign: "center",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
        minHeight: "100vh",
        backgroundColor: "#1E1E1E",
      }}
    >
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-start", marginBottom: "1rem" }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: "#FFF" }} aria-label="voltar">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "1rem" }}>
        Bem-vindo ao Painel de Administração
      </Typography>

      <Typography variant="body1" sx={{ marginBottom: "2rem" }}>
        Escolha qual tabela deseja editar:
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
        <Button
          variant="contained"
          onClick={() => navigate("/admin-manga")}
          sx={{
            backgroundColor: "#FF0037",
            color: "#FFF",
            padding: "1rem 1.2rem",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#CC002A" },
          }}
          aria-label="editar mangás"
        >
          Editar Mangás
        </Button>

        <Button
          variant="contained"
          onClick={() => navigate("/admin-author")}
          sx={{
            backgroundColor: "#FF0037",
            color: "#FFF",
            padding: "1rem 1.2rem",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#CC002A" },
          }}
          aria-label="editar autores"
        >
          Editar Autores
        </Button>
      </Box>
    </Box>
  );
};

export default AdminDashboardPage;
