import { Box, IconButton, Avatar, InputBase, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import useAuth from "../contexts/useAuth";

const Header = ({ searchTerm = "", setSearchTerm = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [showSearch, setShowSearch] = useState(false);

  const isCatalogPage = location.pathname === "/";
  const isProfilePage = location.pathname.startsWith("/profile");
  const isFavoritesPage = location.pathname.startsWith("/favorites");

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
    if (user?.id) {
      navigate(`${route}/${user.id}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: showSearch ? "center" : "space-between",
        alignItems: "center",
        backgroundColor: "#000",
      }}
    >
      {!showSearch && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isFavoritesPage ? (
            <IconButton onClick={handleBackClick} sx={{ color: "#fff", padding: "0px" }}>
              <ArrowBackIcon />
            </IconButton>
          ) : isProfilePage ? (
            <IconButton onClick={handleBackClick} sx={{ color: "#fff" }}>
              <CancelIcon />
            </IconButton>
          ) : !isCatalogPage ? (
            <IconButton onClick={handleBackClick} sx={{ color: "#fff",padding: "0px" }}>
              <ArrowBackIcon />
            </IconButton>
          ) : (
            <Typography
              variant="h6"
              component="a"
              href="/"
              sx={{
                fontWeight: "bold",
                color: "#FF0037",
                textDecoration: "none",
                fontSize: { xs: "1.4em", md: "1.8em", lg: "2.2em" },
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
            maxWidth: { xs: "100%", sm: "100%" },
            backgroundColor: "#1E1E1E",
            color: "#fff",
            borderRadius: "4px",
          }}
        />
      ) : null}

      {/* Botões do Header */}
      {!showSearch && (
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: "0.3em", md: "1em" } }}>
          {isCatalogPage && (
            <IconButton onClick={handleSearchClick} sx={{ color: "#fff" }}>
              <SearchIcon sx={{ width: "30px", height: "30px" }} />
            </IconButton>
          )}

          {!isFavoritesPage && (
            <IconButton
              onClick={() => handleProtectedRoute(user?.role === "admin" ? "/admin-panel" : "/favorites")}
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
              maxWidth: "36px",
              maxHeight: "36px",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

Header.propTypes = {
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
};

export default Header;