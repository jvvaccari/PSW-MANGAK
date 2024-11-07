import { Box, IconButton, Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/"); // Redireciona para a URL raiz
  };

  return (
    <Box className={styles.headerContainer}>
      <IconButton
        color="inherit"
        onClick={handleBackClick}
        sx={{ width: "30px", height: "30px" }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Avatar
        sx={{
          width: "30px",
          height: "30px",
          color: "#fff",
          backgroundColor: "#000",
          border: "2px solid #fff",
        }}
      />
    </Box>
  );
};

export default Header;