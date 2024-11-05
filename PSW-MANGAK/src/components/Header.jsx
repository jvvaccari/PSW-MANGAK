import { Box, IconButton, Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <Box className={styles.headerContainer}>
      {/* Adiciona o evento de clique para redirecionar para a página inicial */}
      <IconButton 
        color="inherit" 
        sx={{ width: "30px", height: "30px" }}
        onClick={() => navigate("/")} // Navega para a página inicial
      >
        <ArrowBackIcon />
      </IconButton>
      
      <Avatar 
        sx={{
          width: 30,
          height: 30,
        }}
      />
    </Box>
  );
};

export default Header;
