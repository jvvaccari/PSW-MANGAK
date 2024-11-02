import { Box, IconButton,Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./Header.module.css";

const Header = (image) => (
  <Box className={styles.headerContainer}>
    <IconButton color="inherit">
      <ArrowBackIcon />
    </IconButton>
    <Avatar src={image} className={styles.avatar} />
  </Box>
);

export default Header;
