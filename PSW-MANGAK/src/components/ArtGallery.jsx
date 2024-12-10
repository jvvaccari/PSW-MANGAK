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
    // <Box sx={{ maxWidth: "56em" }}> // AQUI ELE LIMITA LATERALMENTE O QUANTO O BLOCO ARTS OCUPA
    <Box>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", fontSize: { xs: "0.8em", md: "1em", lg: "1.2em" } }}
      >
        Arts
        <div className={styles.line}></div>
      </Typography>

      <ImageList variant="masonry" cols={3} gap={12} sx={{ marginTop: "32px" }}>
        {artsList.map((img, index) => (
          <ImageListItem key={index} onClick={() => handleOpen(img)} sx={{ overflow: "hidden" }}>
            <img
              src={typeof img === "string" ? img : img.default}
              alt={`Image ${index + 1}`}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // Faz a imagem preencher o espaço do container
                aspectRatio: "3 / 5", // Define uma proporção consistente para todas as imagens
                borderRadius: "8px", // Adiciona bordas arredondadas
                cursor: "pointer",
              }}
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
        display: "block", // Remove possíveis gaps causados por imagens inline
        border: "none", // Remove bordas automáticas
        outline: "none", // Remove outlines padrão de foco
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
