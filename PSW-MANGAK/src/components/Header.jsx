import { Box, IconButton,Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./Header.module.css";

const Header = () => (
  <Box className={styles.headerContainer}>
    <IconButton color="inherit" sx={{width: "30px",height: "30px"}}>
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

export default Header;
