import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import styles from "./Content.module.css";

const Content = ({ mangaImage,title, author, rating, reviews }) => (
  <Box className={styles.container}>
    <img src={mangaImage}/>
    <Box className={styles.mangaData}>
      <Typography variant="h6" className={styles.title}>
        {title}
      </Typography>
      <Typography variant="body2" className={styles.author}>
        {author}
      </Typography>
      <Box className={styles.ratingContainer}>
        <Typography variant="body2" className={styles.rating}>⭐ {rating}</Typography>
        <Typography variant="body2" className={styles.reviews}>
          {reviews}
        </Typography>
      </Box>
    </Box>
  </Box>
);

Content.propTypes = {
  mangaImage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  reviews: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Content;