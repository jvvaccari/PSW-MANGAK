import { Box, IconButton, Typography } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import styles from "./Actions.module.css";
import PropTypes from "prop-types";

const Actions = ({ statusDot, publication }) => (
  <Box className={styles.actionsContainer}>
    <Typography variant="caption" className={styles.publication}>
      <span className={styles.statusDot}>{statusDot}</span> {/* Exibe o conteúdo de statusDot */}
      {publication}
    </Typography>
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

Actions.propTypes = {
  statusDot: PropTypes.string.isRequired,  // Certifique-se de que é uma string
  publication: PropTypes.string.isRequired,
};

export default Actions;