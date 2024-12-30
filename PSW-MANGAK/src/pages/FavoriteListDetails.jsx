import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFavoriteListById, fetchMangasByIds } from "../../services/api"; 
import { Box, Typography, Card, CardMedia, CardContent, CircularProgress, Grid, AppBar, Toolbar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

const FavoriteListDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadList = async () => {
      try {
        const data = await fetchFavoriteListById(id);
        if (data && data.mangas && data.mangas.length > 0) {
          const mangas = await fetchMangasByIds(data.mangas);
          setList({ ...data, mangas });
        } else {
          setList(data);
        }
      } catch (error) {
        console.error("Erro ao carregar lista:", error.message);
        setError("Erro ao carregar a lista de favoritos.");
      } finally {
        setLoading(false);
      }
    };

    loadList();
  }, [id]);

  const handleMangaClick = (mangaId) => {
    navigate(`/manga/${mangaId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#121212" }}>
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography sx={{ color: "#fff", textAlign: "center", marginTop: "20px" }}>
        {error}
      </Typography>
    );
  }

  if (!list) {
    return (
      <Typography sx={{ color: "#fff", textAlign: "center", marginTop: "20px" }}>
        Carregando...
      </Typography>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#121212", minHeight: "100vh" }}>
      <AppBar position="sticky" sx={{ backgroundColor: "#121212" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold" }}>
            {list.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: "16px", marginTop: "16px" }}>
        <Grid container spacing={2} justifyContent="center">
          {list.mangas && list.mangas.length > 0 ? (
            list.mangas.map((manga) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={manga.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    backgroundColor: "#1c1c1c",
                    color: "#fff",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
                    },
                    height: "100%", // Garantir altura consistente
                    maxWidth: "260px", // Limita a largura do card
                    margin: "0 auto", // Garante que o card fique centralizado
                  }}
                  onClick={() => handleMangaClick(manga.id)}
                >
                  <CardMedia
                    component="img"
                    image={manga.image}
                    alt={`Capa do mangá ${manga.title}`}
                    sx={{
                      width: "100%",
                      height: "200px", // Ajustando a altura para uniformidade
                      objectFit: "cover",
                    }}
                  />
                  <CardContent sx={{ textAlign: "center", padding: "12px" }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: "bold", marginBottom: "8px" }}>
                      {manga.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
                      {manga.genres ? manga.genres.join(", ") : "Gêneros não disponíveis"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography sx={{ color: "#fff", textAlign: "center" }}>
              Nenhum mangá na lista.
            </Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default FavoriteListDetails;
