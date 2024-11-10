import { useState } from "react";
import { Box, IconButton, Avatar, InputBase } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import PropTypes from "prop-types";

const Header = ({ searchTerm = "", setSearchTerm = () => {} }) => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  const handleBackClick = () => {
    navigate("/");
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };

  return (
    <Box className={styles.headerContainer}>
      {/* Ícone de voltar */}
      <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
        <IconButton
          color="inherit"
          onClick={handleBackClick}
          sx={{ width: "30px", height: "30px",padding: "0px" }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* Campo de pesquisa estilizado */}
      <Box sx={{ display: "flex", alignItems: "center", flex: 6, justifyContent: "flex-end", gap: "6px" }}>
        {showSearch ? (
          <InputBase
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Busque por mangás (nome, gênero, tema)..."
            className={styles.searchInput}
            onBlur={() => setShowSearch(false)}
            autoFocus
          />
        ) : (
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