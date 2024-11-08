import PropTypes from "prop-types";
import { Box, Typography, Chip } from "@mui/material";
import styles from "./TagsSection.module.css";

const TagsSection = ({ data }) => {
  const {section,tags} = data;
  return(
    <Box className={styles.container}>
      <Typography variant="subtitle1" className={styles.sectionTitle}>
        {section}
      </Typography>
      <Box className={styles.tagsContainer}>
        <div className={styles.line}></div>
        {tags.map((tag, index) => (
          <Chip key={index} label={tag} className={styles.tagChip} />
        ))}
      </Box>
    </Box>
  );
};

TagsSection.propTypes = {
  data: PropTypes.shape({
    section: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default TagsSection;