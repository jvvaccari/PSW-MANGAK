import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import styles from "./Content.module.css";

const Content = ({ mangaImage, title, author, rating, reviews, statusDot, publication }) => (
  <Box className={styles.container}>
    <Box sx={{ display: "flex", flexDirection: "row", gap: "1.2em" }}>
      <img src={mangaImage} alt={title} />
      <Box className={styles.mangaData}>
        <Typography variant="h6" className={styles.title}>
          {title}
        </Typography>
        <Typography variant="body2" className={styles.author}>
          {author}
        </Typography>
        <Box sx={{ display: "flex", gap: "8px", marginTop: "3.6em" }}>
          <Typography variant="body2" sx={{ fontSize: "var(--font-size-body)", color: "var(--rating-color)" }}>
            ⭐ {rating}
          </Typography>
          <Typography variant="body2" className={styles.reviews}>
            {reviews}
          </Typography>
        </Box>
      </Box>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "8px" }}>
      <span className={styles.statusDot}>{statusDot}</span>
      <Typography variant="caption" className={styles.publication}>
        {publication}
      </Typography>
    </Box>
  </Box>
);

Content.propTypes = {
  mangaImage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  reviews: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  statusDot: PropTypes.string.isRequired,
  publication: PropTypes.string.isRequired,
};

export default Content;