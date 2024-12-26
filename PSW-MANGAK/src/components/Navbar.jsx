import {
  Box,
  IconButton,
  Avatar,
  InputBase,
  Typography,
  Button,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import useAuth from "../contexts/useAuth";

const Navbar = ({ searchTerm = "", setSearchTerm = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showSearch, setShowSearch] = useState(false);

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  if (isLoginPage || isRegisterPage) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "3% 5%",
          bgcolor: "transparent",
        }}
      >
        <Typography
          component="a"
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
        <Button
          variant="contained"
          onClick={() => navigate(isRegisterPage ? "/login" : "/register")}
          sx={{
            fontWeight: "bold",
            padding: "2% 5%",
            fontSize: "3.5vw",
            borderRadius: "6px",
            backgroundColor: "#FF0037",
            "&:hover": {
              backgroundColor: "#CC002A", 
            },
            "@media (min-width: 600px)": {
              padding: "6px 16px",
              fontSize: "0.875rem",
            },
          }}
        >
          {isRegisterPage ? "Login" : "Cadastrar"}
        </Button>
      </Box>
    );
  }

  const isCatalogPage = location.pathname === "/";
  const isProfilePage = location.pathname.startsWith("/profile");
  const isFavoritesPage = location.pathname.startsWith("/favorites");

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
      {!isFavoritesPage && (
        <IconButton
          onClick={() =>
            handleProtectedRoute(
              user?.role === "admin" ? "/admin-panel" : "/favorites"
            )
          }
          sx={{ color: "#FF0037" }}
        >
          {user?.role === "admin" ? (
            <EditIcon sx={{ width: "30px", height: "30px" }} />
          ) : (
            <FavoriteIcon sx={{ width: "30px", height: "30px" }} />
          )}
        </IconButton>
      )}
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

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: showSearch ? "center" : "space-between",
        alignItems: "center",
        backgroundColor: "#000",
        padding: "16px",
        marginBottom: "4em"
      }}
    >
      {!showSearch && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isProfilePage ? (
            <IconButton onClick={handleBackClick} sx={{ color: "#fff" }}>
              {isProfilePage ? <CancelIcon /> : <ArrowBackIcon />}
            </IconButton>
          ) : (
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
            padding: "8px"
          }}
        />
      ) : (
        renderNavbarButtons()
      )}
    </Box>
  );
};

Navbar.propTypes = {
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
};

export default Navbar;
