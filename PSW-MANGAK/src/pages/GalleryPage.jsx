import React from 'react';
import { Box } from "@mui/material";
import ArtGallery from "../components/ArtGallery";

function GalleryPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        bgcolor: "#000",
        padding: "16px",
        color: "#fff",
      }}
    >
      <Box
        sx={{
          width: "100%",          
          maxWidth: 320,          
          bgcolor: "#000",
          borderRadius: 2,
          padding: "16px",        
          color: "#fff",
        }}
      >
        <h1>Galeria de Arte</h1>
        <ArtGallery />
      </Box>
    </Box>
  );
}

export default GalleryPage;
