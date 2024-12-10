import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // Importando o componente Navbar
import MangaList from "../components/MangaList";
import { Box, Typography, CircularProgress } from "@mui/material";
import MangaContext from "../contexts/MangaContext";
import backgroundImage from "../assets/img/login-background.jpg"; 

function CatalogPage() {
  const { mangas, loading, error } = useContext(MangaContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleMangaClick = (id) => {
    navigate(`/manga/${id}`);
  };
  

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
        }}
      >
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
        }}
      >
        <Typography sx={{ color: "#fff" }}>{error}</Typography>
      </Box>
    );
  }

  const filteredMangas = mangas.filter((manga) => {
    const search = searchTerm.toLowerCase();

    return (
      manga.id.toString().includes(search) ||
      manga.title.toLowerCase().includes(search) ||
      manga.author.toLowerCase().includes(search) ||
      manga.genres.some((genre) => genre.toLowerCase().includes(search)) ||
      manga.demographic.toLowerCase().includes(search)
    );
  });

  return (
<Box

  sx={{
    display: "flex",
    flexDirection: "column", // Organiza Navbar e Conteúdo em coluna
    minHeight: "100vh", // Garante que ocupa toda a altura da página
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover", // Ajusta o tamanho da imagem de fundo
    backgroundPosition: "center", // Centraliza o fundo
    backgroundRepeat: "no-repeat", // Evita repetição do fundo
    backgroundAttachment: "fixed", // Define o fundo como fixo
  }}
>
  {/* Adicionando a Navbar */}
  <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

  {/* Conteúdo Principal */}
  <Box
    sx={{
      flex: 1, // Faz o conteúdo ocupar o restante do espaço
      width: "100%",
      maxWidth: "100vw",
      bgcolor: "rgba(0, 0, 0, 0.8)", // Fundo com opacidade para contraste
      padding: "16px",
      color: "#fff",
    }}
  >
    {filteredMangas?.length > 0 ? (
      <MangaList
        mangas={filteredMangas}
        searchTerm={searchTerm}
        onMangaClick={handleMangaClick}
        horizontalScroll
      />
    ) : (
      <Typography
        variant="subtitle1"
        sx={{
          marginTop: { xs: "0.5em", sm: "0.8em", lg: "2em" },
          fontWeight: 700,
          fontSize: { xs: "1.2em", md: "1.4em", lg: "1.6em" },
          textAlign: "center",
        }}
      >
        Nenhum mangá encontrado
      </Typography>
    )}
  </Box>
</Box>

  );
}

export default CatalogPage;
