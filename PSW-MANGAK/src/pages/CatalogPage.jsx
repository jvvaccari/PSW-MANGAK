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

        <Typography variant="subtitle1" sx={{marginTop: {xs: "0.5em",sm: "0.8em", lg: "2em"},fontWeight: 700,fontSize: {xs: "0.8em", sm: "1em", md: "1,2em", lg: "1.4em"}}}>
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