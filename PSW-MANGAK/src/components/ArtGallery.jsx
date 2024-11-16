// ArtGallery.jsx
import PropTypes from "prop-types";
import { useState } from "react";
import { Box, Typography, Modal } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import styles from "./ArtGallery.module.css";

function ArtGallery({ artsList }) {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpen = (img) => {
    setSelectedImage(img);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  return (
    <Box sx={{ maxWidth: "56em" }}>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: {xs:"0.8em",md: "1em",lg: "1.2em"}}}>
        Arts
        <div className={styles.line}></div>
      </Typography>

      <ImageList variant="masonry" cols={3} gap={12} sx={{ marginTop: "32px",border: "1px solid #bbb"}}>
        {artsList.map((img, index) => (
          <ImageListItem key={index} onClick={() => handleOpen(img)}>
            <img
              src={typeof img === "string" ? img : img.default}
              alt={`Image ${index + 1}`}
              loading="lazy"
              style={{ width: "100%", height: "auto", cursor: "pointer" }}
            />
          </ImageListItem>
        ))}
      </ImageList>

      <Modal open={open} onClose={handleClose} closeAfterTransition>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 0.1,
            outline: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "90vw",
            maxHeight: "90vh",
          }}
        >
          <img
            src={selectedImage}
            alt="Selected artwork"
            style={{
              width: "auto",
              height: "100%",
              maxWidth: "90vw",
              maxHeight: "90vh",
              borderRadius: "10px",
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
}

ArtGallery.propTypes = {
  artsList: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default ArtGallery;