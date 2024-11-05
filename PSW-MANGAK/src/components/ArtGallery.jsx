import PropTypes from "prop-types";
import { Box,Typography } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import styles from "./ArtGallery.module.css"

function ArtGallery({ imageList }) {
  return (
    <Box sx={{ maxWidth: "56em"}}>
      <Typography variant="subtitle1" className={styles.galleryTitle}>
        Art
        <div className={styles.line}></div>
      </Typography>
      
      <ImageList variant="masonry" cols={3} gap={12} sx={{marginTop: "32px"}}>
        {imageList.map((img, index) => (
          <ImageListItem key={index}>
            <img
              src={typeof img === 'string' ? img : img.default}
              alt={`Image ${index + 1}`}
              loading="lazy"
              style={{ width: "100%", height: "auto" }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}

ArtGallery.propTypes = {
  imageList: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default ArtGallery;