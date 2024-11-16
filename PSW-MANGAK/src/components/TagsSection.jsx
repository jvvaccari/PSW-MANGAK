import PropTypes from "prop-types";
import { Box, Typography, Chip, Button } from "@mui/material";
import styles from "./TagsSection.module.css";

const TagsSection = ({ data }) => {
  const { section, tags } = data;

  return (
    <Box className={styles.container}>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold",fontSize: {xs:"0.8em",md: "1em",lg: "1.2em"}}}>
        {section}
      </Typography>
      <Box className={styles.tagsContainer} sx={{ margin: "6px 0" }}>
        <Box sx={{ borderTop: "1px solid #444", width: "40%", marginBottom: "24px" }}></Box>

        {section === "Buy"
          ? tags.map((tag, index) => (
              <Button
                key={index}
                href={tag.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                color="secondary"
                sx={{
                  margin: "0 1.2em 1.2em 0",
                  padding: "6px 12px",
                  backgroundColor: "#1E1E1E",
                  color: "#fff",
                  textTransform: "none",
                }}
              >
                {tag.name}
              </Button>
            ))
          : tags.map((tag, index) => (
              <Chip key={index} label={tag} className={styles.tagChip} />
            ))}
      </Box>
    </Box>
  );
};

TagsSection.propTypes = {
  data: PropTypes.shape({
    section: PropTypes.string.isRequired,
    tags: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })
      ),
    ]).isRequired,
  }).isRequired,
};

export default TagsSection;