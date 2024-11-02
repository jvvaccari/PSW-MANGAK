import { Box, Typography } from "@mui/material";
import styles from "./Description.module.css";
import PropTypes from "prop-types";

const Description = ({ text = "Broke young man + chainsaw demon = Chainsaw Man! Denji was a small-time devil hunter just trying to survive in a harsh world. After being killed on a job, he is revived by his pet devil-dog Pochita and becomes something new and dangerous—Chainsaw Man!" }) => (
  <Box className={styles.descriptionContainer}>
    <Typography variant="body2" className={styles.descriptionText}>
      {text}
    </Typography>
  </Box>
);

Description.propTypes = {
    text: PropTypes.string.isRequired,
};

export default Description;
