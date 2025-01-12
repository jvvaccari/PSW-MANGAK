import { Box, IconButton, Avatar, InputBase, Typography, AppBar, Button, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import useAuth from "../contexts/useAuth";

const Navbar = ({ searchTerm = "", setSearchTerm = () => {}, loading = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showSearch, setShowSearch] = useState(false);

  const isCatalogPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  const handleBackClick = () => navigate(-1);
  const handleSearchClick = () => setShowSearch(true);
  const handleBlur = () => setShowSearch(false);

  const handleProtectedRoute = (route) => {
    user?.id ? navigate(`${route}/${user.id}`) : navigate("/login");
  };

  const renderNavbarButtons = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: "0.3em", md: "1em" },
      }}
    >
      {isCatalogPage && (
        <IconButton onClick={handleSearchClick} sx={{ color: "#fff" }}>
          <SearchIcon sx={{ width: "30px", height: "30px" }} />
        </IconButton>
      )}
      <IconButton
        aria-label={user?.role === "admin" ? "Abrir painel administrativo" : "Abrir favoritos"}
        onClick={() => {
          if (user?.role === "admin") {
            navigate("/admin-dashboard");
          } else if (user?.id) {
            navigate("/favorites/lists");
          } else {
            navigate("/login");
          }
        }}
        sx={{ color: user?.role === "admin" ? "#FFFFFF" : "#FF0037" }}
      >
        {user?.role === "admin" ? <EditIcon sx={{ width: "30px", height: "30px" }} /> : <FavoriteIcon sx={{ width: "30px", height: "30px" }} />}
      </IconButton>
      <Avatar
        onClick={() => handleProtectedRoute("/profile")}
        sx={{
          cursor: "pointer",
          backgroundColor: "#2c2c2c",
          width: 36,
          height: 36,
        }}
      />
    </Box>
  );

  const renderAuthButton = () => {
    if (isLoginPage) {
      return (
        <Button
          variant="contained"
          type="submit"
          disabled={loading}
          sx={{
            bgcolor: "#FF0037",
            color: "#fff",
            padding: "10px 20px",
            fontWeight: "bold",
            fontSize: "1rem",
            borderRadius: "8px",
            "&:hover": { bgcolor: "#CC002A" },
            "@media (min-width: 600px)": {
              padding: "8px 18px",
              fontSize: "1rem",
            },
          }}
          onClick={() => navigate("/register")}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Registrar"}
        </Button>
      );
    }

    if (isRegisterPage) {
      return (
        <Button
          variant="contained"
          type="submit"
          disabled={loading}
          sx={{
            bgcolor: "#FF0037",
            color: "#fff",
            padding: "10px 20px",
            fontWeight: "bold",
            fontSize: "1rem",
            borderRadius: "8px",
            "&:hover": { bgcolor: "#CC002A" },
            "@media (min-width: 600px)": {
              padding: "8px 24px",
              fontSize: "1rem",
            },
          }}
          onClick={() => navigate("/login")}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Login"}
        </Button>
      );
    }

    return renderNavbarButtons();
  };

  return (
    <AppBar
      sx={{
        display: "flex",
        justifyContent: showSearch ? "center" : "space-between",
        alignItems: "center",
        backgroundColor: "#000",
        padding: "16px",
        flexDirection: "row",
        position: "relative",
        width: "100%",
      }}
    >
      {!showSearch && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isCatalogPage || isLoginPage || isRegisterPage ? (
            <Typography
              variant="h6"
              component="a"
              href="/"
              sx={{
                fontWeight: "bold",
                color: "#FF0037",
                fontSize: "6vw",
                textDecoration: "none",
                "@media (min-width: 600px)": {
                  fontSize: "1.8rem",
                },
              }}
            >
              MANGAK
            </Typography>
          ) : (
            <IconButton onClick={handleBackClick} sx={{ color: "#fff" }}>
              <ArrowBackIcon />
            </IconButton>
          )}
        </Box>
      )}
      {showSearch ? (
        <InputBase
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Busque por mangás..."
          onBlur={handleBlur}
          autoFocus
          sx={{
            flex: 1,
            maxWidth: "100%",
            backgroundColor: "#1E1E1E",
            color: "#fff",
            borderRadius: "4px",
            padding: "8px",
          }}
        />
      ) : (
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
          {renderAuthButton()}
        </Box>
      )}
    </AppBar>
  );
};

Navbar.propTypes = {
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
  loading: PropTypes.bool,
};

export default Navbar;
