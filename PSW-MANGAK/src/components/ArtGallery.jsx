import PropTypes from "prop-types";
import { useState } from "react";
import { Box, Typography, Modal, ImageList, ImageListItem } from "@mui/material";
import styles from "./ArtGallery.module.css";

function ArtGallery({ artsList }) {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const toggleModal = (img = null) => {
    setSelectedImage(img);
    setOpen(!!img);
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    aspectRatio: "3 / 5",
    borderRadius: "8px",
    cursor: "pointer",
  };

  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
    outline: "none",
  };

  return (
    <>
     <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", fontSize: { xs: "1.2em", md: "2em", lg: "2.8em",color: "#fff",marginTop: "2em" } }}
      >
        Art Gallery
        <div className={styles.line}></div>
      </Typography>
    <Box sx={{display: "flex",justifyContent: "center"}}>
     

      <ImageList variant="masonry" cols={3} gap={12} sx={{ marginTop: "32px",maxWidth: "86%" }}>
        {artsList.map((img, index) => (
          <ImageListItem key={index} onClick={() => toggleModal(img)} sx={{ overflow: "hidden" }}>
            <img
              src={typeof img === "string" ? img : img.default}
              alt={`Image ${index + 1}`}
              loading="lazy"
              style={imageStyle}
            />
          </ImageListItem>
        ))}
      </ImageList>

      <Modal open={open} onClose={() => toggleModal()} closeAfterTransition>
        <Box sx={modalStyle}>
          <img
            src={selectedImage}
            alt="Selected artwork"
            style={{
              maxWidth: "100vw",
              maxHeight: "94vh",
              borderRadius: "10px",
            }}
          />
        </Box>
      </Modal>
    </Box>
    </>
    
  );
}

ArtGallery.propTypes = {
  artsList: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default ArtGallery;
