import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import styles from "./Description.module.css";

const Description = ({ 
  text = "Broke young man + chainsaw demon = Chainsaw Man! Denji was a small-time devil hunter just trying to survive in a harsh world. After being killed on a job, he is revived by his pet devil-dog Pochita and becomes something new and dangerous—Chainsaw Man!" 
}) => {
  const textStyle = {
    fontSize: "1em",
  };

  return (
    <Box className={styles.descriptionContainer}>
      <Typography variant="body2" sx={textStyle}>
        {text}
      </Typography>
    </Box>
  );
};

Description.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Description;
