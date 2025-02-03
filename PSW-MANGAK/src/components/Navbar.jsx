import { Box, IconButton, Avatar, InputBase, Typography, AppBar, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import * as api from "../../services/api";
import PropTypes from "prop-types";

const Navbar = ({ searchTerm = "", setSearchTerm = () => {}}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId && !user) {
      api.fetchAccountById(userId)
        .then((fetchedUser) => {
          if (fetchedUser) {
            setUser(fetchedUser);
          } else {
            navigate("/login");
          }
        })
    } 
  }, [navigate, user]);

  const isCatalogPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleBlur = () => {
    setShowSearch(false);
  };

  const handleProtectedRoute = (route) => {
    if (user?._id) {
      console.log(`${route}/${user._id}`);
      navigate(`${route}/${user._id}`);
    } else {
      navigate("/login");
    }
  };

  const renderNavbarButtons = () => (
    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: "0.3em", md: "1em" } }}>
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
          } else {
            handleProtectedRoute("/favorites");
          }
        }}
        sx={{ color: user?.role === "admin" ? "#FFFFFF" : "#FF0037" }}
      >
        {user?.role === "admin" ? <EditIcon sx={{ width: "30px", height: "30px" }} /> : <FavoriteIcon sx={{ width: "30px", height: "30px" }} />}
      </IconButton>
      <Avatar onClick={() => handleProtectedRoute(`/profile`)} sx={{ cursor: "pointer", backgroundColor: "#2c2c2c", width: 36, height: 36 }} />
    </Box>
  );

  const renderAuthButton = () => {
    if (isLoginPage) {
      return (
        <Button
          variant="contained"
          type="submit"
          sx={{ bgcolor: "#FF0037", color: "#fff", padding: "10px 20px", fontWeight: "bold", fontSize: "1rem", borderRadius: "8px", "&:hover": { bgcolor: "#CC002A" } }}
          onClick={() => navigate("/register")}
        >
           Registrar
        </Button>
      );
    }
    if (isRegisterPage) {
      return (
        <Button
          variant="contained"
          type="submit"
          sx={{ bgcolor: "#FF0037", color: "#fff", padding: "10px 20px", fontWeight: "bold", fontSize: "1rem", borderRadius: "8px", "&:hover": { bgcolor: "#CC002A" } }}
          onClick={() => navigate("/login")}
        >
         Login
        </Button>
      );
    }
    return renderNavbarButtons();
  };

  return (
    <AppBar sx={{ display: "flex", justifyContent: showSearch ? "center" : "space-between", alignItems: "center", backgroundColor: "#000", padding: "16px", flexDirection: "row", position: "relative", width: "100%" }}>
      {!showSearch && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isCatalogPage || isLoginPage || isRegisterPage ? (
            <Typography variant="h6" component="a" href="/" sx={{ fontWeight: "bold", color: "#FF0037", fontSize: "2em", textDecoration: "none" }}>
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
          sx={{ flex: 1, maxWidth: "100%", backgroundColor: "#1E1E1E", color: "#fff", borderRadius: "4px", padding: "8px" }}
        />
      ) : (
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>{renderAuthButton()}</Box>
      )}
    </AppBar>
  );
};

Navbar.propTypes = {
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
};

export default Navbar;