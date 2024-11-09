import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Header from "../components/Header";
import MangaList from "../components/MangaList";
import mangasData from "../BD/mangasData";
import { Box } from "@mui/material";

function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Hook para navegação

  const handleMangaClick = (id) => {
    navigate(`/manga/${id}`); // Redireciona para a página de detalhes do mangá
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

        <MangaList
          mangas={mangasData}
          searchTerm={searchTerm}
          onMangaClick={handleMangaClick} // Use a função de clique para redirecionamento
          horizontalScroll
        />
      </Box>
    </Box>
  );
}

export default CatalogPage;