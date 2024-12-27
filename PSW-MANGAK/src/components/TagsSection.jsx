import PropTypes from "prop-types";
import { Box, Typography, Button } from "@mui/material";
import styles from "./TagsSection.module.css";

const TagsSection = ({ data }) => {
  const { section, tags } = data;

  return (
    <Box className={styles.container}>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: "bold",
          fontSize: { xs: "0.8em", md: "1em", lg: "1.2em" },
        }}
      >
        {section}
      </Typography>
      <Box className={styles.tagsContainer} sx={{ margin: "6px 0" }}>
        <Box
          sx={{
            borderTop: "1px solid #444",
            width: "46%",
            marginBottom: "24px",
          }}
        ></Box>

        {tags.map((tag, index) =>
          typeof tag === "object" && tag.name && tag.url ? (
            // Renderiza botões com links para a seção "retail"
            <Button
              key={index}
              href={tag.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              sx={{
                fontWeight: 600,
                margin: "0 1.2em 1.2em 0",
                padding: "8px 16px",
                backgroundColor: "#FF0037",
                color: "#fff",
                textTransform: "none",
                ":hover": {
                  backgroundColor: "#CC002A",
                  transform: "scale(1.1)",
                },
              }}
            >
              {tag.name}
            </Button>
          ) : (
            // Renderiza botões sem links para seções como "Genres" e "Demographic"
            <Button
              key={index}
              variant="contained"
              sx={{
                fontWeight: 600,
                margin: "0 1.2em 1.2em 0",
                padding: "8px 16px",
                backgroundColor: "#1e1e1e",
                color: "#fff",
                textTransform: "none",
                cursor: "default",
              }}
            >
              {tag}
            </Button>
          )
        )}
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
