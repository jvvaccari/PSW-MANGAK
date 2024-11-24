import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import MangaList from "../components/MangaList";
import { Box, Typography, CircularProgress } from "@mui/material";
import { fetchFavorites } from "../../services/api";

function FavoritesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const userId = 1; // Substituir pelo ID do usuário autenticado, se disponível
        const favoriteMangas = await fetchFavorites(userId);
        setMangas(favoriteMangas || []);
      } catch (err) {
        console.error("Erro ao carregar favoritos:", err);
        setError("Falha ao carregar seus favoritos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
  
    loadFavorites();
  }, []);

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

  const handleMangaClick = (id) => {
    navigate(`/manga/${id}`);
  };

  <MangaList
  mangas={filteredMangas}
  searchTerm={searchTerm}
  onMangaClick={handleMangaClick}
/>

  
  
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  
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
        }}
      >
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

{filteredMangas?.length > 0 ? (
  <>
    <Typography
      variant="subtitle1"
      sx={{
        marginTop: { xs: "1.2em", sm: "1.4em", lg: "2em" },
        fontWeight: 700,
        fontSize: { xs: "1.2em", md: "1.4em", lg: "1.6em" },
      }}
    >
      Seus Mangás Favoritos
    </Typography>
    <MangaList
      mangas={filteredMangas}
      searchTerm={searchTerm}
      onMangaClick={handleMangaClick}
      horizontalScroll
    />
  </>
) : (
  <Typography
    variant="subtitle1"
    sx={{
      marginTop: { xs: "0.5em", sm: "0.8em", lg: "2em" },
      fontWeight: 700,
      fontSize: { xs: "1.2em", md: "1.4em", lg: "1.6em" },
    }}
  >
    Você ainda não tem mangás favoritos!
  </Typography>
)}


      </Box>
    </Box>
  );
}

export default FavoritesPage;