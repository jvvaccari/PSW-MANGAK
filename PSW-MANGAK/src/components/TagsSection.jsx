import PropTypes from "prop-types";
import { Box, Typography, Chip } from "@mui/material";
import styles from "./TagsSection.module.css";

const TagsSection = ({ section, tags }) => (
  <Box className={styles.container}>
    <Typography variant="subtitle1" className={styles.sectionTitle}>
      {section}
    </Typography>
    <Box className={styles.tagsContainer}>
      {tags.map((tag, index) => (
        <Chip key={index} label={tag} className={styles.tagChip} />
      ))}
    </Box>
  </Box>
);

TagsSection.propTypes = {
  section: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TagsSection;