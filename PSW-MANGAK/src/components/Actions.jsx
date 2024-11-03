import { Box, IconButton } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import styles from "./Actions.module.css";

const Actions = () => (
  <Box className={styles.actionsContainer}>
    <Box>
      <IconButton color="inherit">
        <LinkIcon />
      </IconButton>
      <IconButton color="inherit">
        <ThumbUpIcon />
      </IconButton>
    </Box>
  </Box>
);

export default Actions;