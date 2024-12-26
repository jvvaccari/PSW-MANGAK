import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Container } from "@mui/material";
import Navbar from "../components/Navbar";
import MangaList from "../components/MangaList";
import { fetchFavorites } from "../../services/api";
import { useNavigate } from "react-router-dom";
import useAuth from "../contexts/useAuth";

const FavoritesPage = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setError("Você precisa estar logado para acessar seus favoritos.");
      setLoading(false);
      navigate("/login");
      return;
    }

    const loadFavorites = async () => {
      try {
        const data = await fetchFavorites(user.id);
        setFavorites(data);
      } catch {
        setError("Erro ao carregar seus favoritos.");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user, navigate]);

  const filteredFavorites = favorites.filter((manga) =>
    manga.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, fontSize: "1.4em", color: "red" }}
        >
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <Container maxWidth="xxl">
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
            {filteredFavorites.length > 0 ? (
              <>
                <Typography
                  variant="subtitle1"
                  sx={{
                    marginTop: "2em",
                    marginBottom: "3em",
                    fontWeight: 700,
                    fontSize: "2em",
                    borderBottom: "1px solid #fff",
                  }}
                >
                  Seus Mangás Favoritos
                </Typography>
                <MangaList
                  mangas={filteredFavorites}
                  searchTerm={searchTerm}
                  onMangaClick={(id) => navigate(`/manga/${id}`)}
                  horizontalScroll
                />
              </>
            ) : (
              <Typography
                variant="subtitle1"
                sx={{
                  marginTop: "2em",
                  fontWeight: 700,
                  fontSize: "1.6em",
                  textAlign: "center",
                }}
              >
                Você ainda não tem mangás favoritos!
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default FavoritesPage;
