import PropTypes from "prop-types";
import { AppBar, Toolbar, IconButton, InputBase, Box, Typography } from "@mui/material";
import { ArrowBack, Search, Favorite, AccountCircle, AdminPanelSettings } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../contexts/useAuth"; // Importa o contexto de autenticação

const Navbar = ({ searchTerm, setSearchTerm, backButton, onBackClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtém o usuário autenticado
  const [showSearch, setShowSearch] = useState(false); // Controla se a barra de busca está visível

  const handleSearchToggle = () => {
    setShowSearch((prev) => !prev); // Alterna entre mostrar e esconder a barra de busca
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "rgba(0, 0, 0, 0.95)" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Substitui "MANGAK" pela seta de voltar, se backButton for true */}
        {backButton ? (
          <IconButton
            onClick={onBackClick || (() => navigate(-1))} // Usa a função de voltar passada ou o padrão
            sx={{ color: "#FFFFFF" }}
          >
            <ArrowBack />
          </IconButton>
        ) : (
          <Typography
            onClick={() => navigate("/")}
            sx={{
              fontWeight: "bold",
              color: "#FF0037",
              fontSize: "1.8rem",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            MANGAK
          </Typography>
        )}

        {/* Ícones de favoritos, busca, usuário e admin */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Ícone de busca (ocultado na MangaLandingPage) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative", // Para alinhar a lupa e a barra de busca
            }}
          >
            <IconButton
              color="inherit"
              onClick={handleSearchToggle}
              sx={{
                zIndex: 2, // Mantém a lupa acima da barra de busca
              }}
            >
              <Search />
            </IconButton>
            <InputBase
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              sx={{
                position: "absolute",
                right: 0,
                color: "inherit",
                bgcolor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "4px",
                padding: "4px 8px",
                width: showSearch ? "11rem" : "0",
                opacity: showSearch ? 1 : 0,
                overflow: "hidden",
                transition: "all 0.3s ease-in-out",
              }}
            />
          </Box>

          {/* Ícone de favoritos - Apenas para usuários que não são administradores */}
          {user?.role !== "admin" && (
            <IconButton
              color="inherit"
              onClick={() => navigate("/favorites")}
            >
              <Favorite />
            </IconButton>
          )}

          {/* Ícone de administração - Apenas para administradores */}
          {user?.role === "admin" && (
            <IconButton
              color="inherit"
              onClick={() => navigate("/admin-panel")}
            >
              <AdminPanelSettings />
            </IconButton>
          )}

          {/* Ícone de usuário */}
          <IconButton
            color="inherit"
            onClick={() => navigate("/profile")}
          >
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  backButton: PropTypes.bool, // Indica se deve mostrar a seta de voltar
  onBackClick: PropTypes.func, // Define a ação da seta de voltar
};

export default Navbar;
