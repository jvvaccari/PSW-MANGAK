import PropTypes from "prop-types";
import { Box, Typography, Rating } from "@mui/material";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import styles from "./Content.module.css";

const Content = ({ mangaImage, title, author, reviews, statusDot, publication }) => (
  <Box className={styles.container}>
    <Box sx={{ display: "flex", flexDirection: "row", gap: "1.2em" }}>
      <img src={mangaImage} alt={title} />
      <Box className={styles.mangaData}>
        <Typography variant="h6" className={styles.manga_name}>
          {title}
        </Typography>
        <Typography variant="body2" className={styles.author}>
          {author}
        </Typography>
        <Box sx={{ display: "flex", gap: "8px", marginTop: "3.6em" }}>
          <Rating name="size-small" defaultValue={2} size="small" 
            sx={{
              "& .MuiRating-iconEmpty": {
                color: "#777",
              },
              "& .MuiRating-iconFilled": {
                color: "#EC7C01",
              },
              "& .MuiRating-iconHover": {
                color: "#FFA500",
              },
            }}
          />
          <Typography variant="body2" sx={{ fontSize: "var(--font-size-body)", color: "var(--text-color)",display: "flex"}}>
            <BookmarkIcon sx={{height: "18px"}}/>
            {reviews}
          </Typography> 
        </Box>
      </Box>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center",  marginTop: "8px" }}>
      <span className={styles.statusDot}>{statusDot}</span>
      <Typography variant="caption">
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