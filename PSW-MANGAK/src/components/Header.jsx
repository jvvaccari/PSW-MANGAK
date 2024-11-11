// Header.jsx
import { useState } from "react";
import { Box, IconButton, Avatar, InputBase, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import PropTypes from "prop-types";

const Header = ({ searchTerm = "", setSearchTerm = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);

  const isCatalogPage = location.pathname === "/";

  const handleBackClick = () => {
    navigate("/");
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };

  return (
    <Box className={styles.headerContainer}>
      <Box sx={{ display: "flex", alignItems: "center", flex: 0 }}>
        {!isCatalogPage && (
          <IconButton
            color="inherit"
            onClick={handleBackClick}
            sx={{ width: "30px", height: "30px", padding: "0px", marginLeft: "-5px" }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
        {isCatalogPage && showSearch ? (
          <InputBase
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Busque por mangás (nome, gênero, tema)..."
            className={styles.searchInput}
            onBlur={() => setShowSearch(false)}
            autoFocus
            sx={{
              width: "100%",
              backgroundColor: "#1E1E1E",
              padding: "0 10px",
              borderRadius: "5px",
            }}
          />
        ) : isCatalogPage && !showSearch ? (
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: "#FF0000" }}
          >
            MANGAK
          </Typography>
        ) : null}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", flex: 0, justifyContent: "flex-end", gap: "6px" }}>
        {isCatalogPage && !showSearch && (
          <IconButton
            color="inherit"
            onClick={handleSearchClick}
            sx={{ width: "30px", height: "30px" }}
          >
            <SearchIcon className={styles.searchIcon} />
          </IconButton>
        )}
        {!showSearch && <Avatar className={styles.avatarIcon} />}
      </Box>
    </Box>
  );
};

Header.propTypes = {
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
};

export default Header;