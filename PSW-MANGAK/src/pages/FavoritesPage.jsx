import { useEffect, useState, useContext } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import Header from "../components/Header";
import MangaList from "../components/MangaList";
import UserContext from "../contexts/UserContext";
import { fetchFavorites } from "../../services/api";
import { useNavigate } from "react-router-dom";

const FavoritesPage = () => {
  const { userId } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        if (!userId) {
          throw new Error("Usuário não autenticado");
        }
        const data = await fetchFavorites(userId);
        setFavorites(data);
      } catch (err) {
        console.error("Erro ao carregar favoritos:", err.message);
        setError("Erro ao carregar seus favoritos");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [userId]);

  const handleMangaClick = (id) => {
    navigate(`/manga/${id}`); // Redireciona para a rota de detalhes do mangá
  };

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
    return (
      <Typography
        variant="subtitle1"
        sx={{
          marginTop: { xs: "2em", sm: "2.5em", lg: "3em" },
          textAlign: "center",
          color: "red",
          fontWeight: 700,
          fontSize: { xs: "1.2em", md: "1.4em", lg: "1.6em" },
        }}
      >
        {error}
      </Typography>
    );
  }

  const filteredFavorites = favorites.filter((manga) =>
    manga.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {filteredFavorites.length > 0 ? (
          <>
            <Typography
              variant="subtitle1"
              sx={{
                marginTop: { xs: "3em", sm: "4em", lg: "5em" },
                fontWeight: 700,
                fontSize: { xs: "1.2em", md: "1.4em", lg: "1.6em" },
              }}
            >
              Seus Mangás Favoritos
            </Typography>
            <MangaList
              mangas={filteredFavorites}
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
              textAlign: "center",
            }}
          >
            Você ainda não tem mangás favoritos!
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default FavoritesPage;