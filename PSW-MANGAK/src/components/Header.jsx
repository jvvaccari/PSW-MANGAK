import { Box, IconButton, Avatar, InputBase, Typography } from "@mui/material";
import { useUser } from "../contexts/useUser";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import styles from "./Header.module.css";
import PropTypes from "prop-types";

const Header = ({ searchTerm = "", setSearchTerm = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);

  const isCatalogPage = location.pathname === "/";
  const isProfilePage = location.pathname.startsWith("/profile");
  const { userId } = useUser();
  
  const handleBackClick = () => {
    navigate(-1); 
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };

  return (
    <Box className={styles.headerContainer}>
      <Box sx={{ display: "flex", alignItems: "center", flex: 0 }}>
        {isProfilePage ? (
          <IconButton
            color="inherit"
            onClick={handleBackClick}
            sx={{ position: "absolute",top: "12px",left: "92%",transform: "translateX(-50%)", width: "36px", height: "36px", padding: "0px" }}
          >
            <CancelIcon sx={{cursor: "pointer",borderRadius: "120px",border: "2px solid #fff"}}/>
          </IconButton>
        ) : (
          !isCatalogPage && (
            <IconButton
              color="inherit"
              onClick={handleBackClick}
              sx={{ width: "30px", height: "30px", padding: "0px", marginLeft: "-5px" }}
            >
              <ArrowBackIcon sx={{cursor: "pointer"}}/>
            </IconButton>
          )
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
            sx={{
              fontWeight: "bold",
              color: "#FF0000",
              fontSize: { xs: "1.2em", md: "1.6em", lg: "1.8em" },
            }}
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
        {!isProfilePage && (
          <Avatar
          sx={{cursor: "pointer"}}
          onClick={() => navigate(`/profile/${userId}`)}
          className={styles.avatarIcon}
        />
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