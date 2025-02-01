import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Button, Box, Typography, IconButton, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = (path) => {
    if (!user?.id) {
      console.error("Usuário não autenticado. Redirecionando para o login.");
      navigate("/login");
      return;
    }
    setIsLoading(true);
    navigate(path);
  };

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
        backgroundColor: "#1E1E1E", // Fundo escuro para consistência com o tema
      }}
    >
      {/* Botão para voltar */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <IconButton onClick={() => navigate(-1)} sx={{ color: "#FFF" }} aria-label="voltar">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* Cabeçalho */}
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", marginBottom: "1rem" }}
      >
        Bem-vindo ao Painel de Administração
      </Typography>

      <Typography variant="body1" sx={{ marginBottom: "2rem" }}>
        Escolha qual tabela deseja editar:
      </Typography>

      {/* Botões de navegação */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
        <Button
          variant="contained"
          onClick={() => handleNavigation(`/admin-manga`)}
          sx={{
            backgroundColor: "#FF0037",
            color: "#FFF",
            padding: "1rem 1.2rem",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#CC002A",
            },
          }}
          disabled={isLoading}
          aria-label="editar mangás"
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Editar Mangás"}
        </Button>
        <Button
          variant="contained"
          onClick={() => handleNavigation("/admin-author")}
          sx={{
            backgroundColor: "#FF0037",
            color: "#FFF",
            padding: "1rem 1.2rem",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#CC002A",
            },
          }}
          disabled={isLoading}
          aria-label="editar autores"
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Editar Autores"}
        </Button>
      </Box>
    </Box>
  );
};

export default AdminDashboardPage;
