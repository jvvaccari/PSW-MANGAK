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
  const isDataAccountPage = location.pathname === "/DataAccount";

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
            sx={{ width: "30px", height: "30px", padding: "0px", marginLeft: "-5px", }}
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
              backgroundColor: "#2c2c2c",
              padding: "0 12px",
              borderRadius: "5px",
            }}
          />
        ) : isCatalogPage && !showSearch ? (
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: "#FF0000",fontSize: {xs: "1em", sm: "1.25em", md: "1,5em", lg: "2em",}}}
          >
            MANGAK
          </Typography>
        ) : null}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", flex: 0, justifyContent: "flex-end", gap: {xs: "0.5em", md:"0.8em",lg: "1.1em"} }}>
        {isCatalogPage && (
          <Avatar className={styles.avatarIcon} sx={{fontSize: {xs: "0.9em", md:"1.1em",lg: "1.3em"}}}/>
        )}
      </Box>
      
    </Box>
  );
};

Header.propTypes = {
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
};

export default Header;