import { useNavigate } from "react-router-dom";
import { Button, Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useAuth from "../contexts/useAuth"; // Importa o contexto de autenticação

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtém o usuário autenticado

  const handleNavigation = (path) => {
    if (!user?.id) {
      console.error("Usuário não autenticado. Redirecionando para o login.");
      navigate("/login");
      return;
    }
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
        <IconButton onClick={() => navigate(-1)} sx={{ color: "#FFF" }}>
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
          onClick={() => handleNavigation(`/admin-manga/${user?.id}`)}
          sx={{
            backgroundColor: "#FF0037",
            color: "#FFF",
            padding: "1rem 1.2rem",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#CC002A",
            },
          }}
        >
          Editar Mangás
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
        >
          Editar Autores
        </Button>
      </Box>
    </Box>
  );
};

export default AdminDashboardPage;
