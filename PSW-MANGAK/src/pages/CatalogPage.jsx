import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import MangaList from "../components/MangaList";
import mangasData from "../BD/mangasData";
import { Box, Typography } from "@mui/material";

function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleMangaClick = (id) => {
    navigate(`/manga/${id}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        bgcolor: "#000",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "100vw",
          bgcolor: "#000",
          padding: "16px",
          color: "#fff",
          overflow: "hidden",
        }}
      >
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <Typography variant="subtitle1" sx={{marginBottom: "6px",fontWeight: 700}}>
          Procura por Categoria
        </Typography>

        <MangaList
          mangas={mangasData}
          searchTerm={searchTerm}
          onMangaClick={handleMangaClick}
          horizontalScroll
        />
      </Box>
    </Box>
  );
}

export default CatalogPage;