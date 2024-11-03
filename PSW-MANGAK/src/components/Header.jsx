import { Box, IconButton,Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./Header.module.css";

const Header = () => (
  <Box className={styles.headerContainer}>
    <IconButton color="inherit">
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

export default Header;
