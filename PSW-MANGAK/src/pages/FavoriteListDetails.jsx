import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import * as api from "../../services/api";

const FavoriteListDetails = () => {
  const { user } = useSelector((state) => state.auth);
  const { listId } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [mangas,setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadList = async () => {
      console.log("userId:", user.id);  // Verifique se o userId está correto

      if (!user.id) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      try {
        console.log("listId:",listId);
        const list = await api.fetchFavoriteListById(listId);
        console.log("Resposta da API:", list);  // Verifique a resposta da API

        if (list) {
          console.log(list.mangas);
          setList(list);
        } else {
          setList(null);
          setError("Nenhuma lista com mangas encontrada.");
        }
      } catch (error) {
        console.error("Erro ao carregar lista:", error.message);
        setError("Erro ao carregar a lista de favoritos.");
      } finally {
        setLoading(false);
      }
    };

    loadList();
  }, [listId, user]);

  useEffect(() => {
    const loadMangas = async () => {
      try{
        const favoriteMangas = await api.fetchMangasByListId(listId);
        setMangas(favoriteMangas);
      } catch (error) {
        console.error("Erro ao carregar mangas:", error.message);
      }
    };

    loadMangas();
  }, [listId, mangas]);

  const handleMangaClick = (mangaId) => {
    console.log("Clicou no manga com ID:", mangaId);  
    navigate(`/manga/${mangaId}`);
  };

  const handleRemoveManga = async (mangaId) => {
    console.log("Tentando remover manga com ID:", mangaId); 
    try {
      if (!list) {
        throw new Error("Lista de favoritos não encontrada.");
      }
  
      const success = await api.removeMangaFromFavoriteList(listId, mangaId);  
      if (success) {
        setList((prevState) => ({
          ...prevState,
          mangas: prevState.mangas.filter((manga) => manga !== mangaId),  
        }));
      } else {
        throw new Error("Erro ao remover manga do banco de dados");
      }
    } catch (error) {
      setError(`Erro ao remover o mangá: ${error.message}`);
      console.error("Erro ao remover manga:", error);
    }
  };
  

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#121212" }}>
        <CircularProgress sx={{ color: "#FF0037" }} />
      </Box>
    );

  if (error)
    return (
      <Typography sx={{ color: "#FF0037", textAlign: "center", marginTop: "20px" }}>
        {error}
      </Typography>
    );

  return (
    <Box sx={{ backgroundColor: "#121212", minHeight: "100vh" }}>
      <AppBar position="sticky" sx={{ backgroundColor: "#121212", boxShadow: "none" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold" }}>
            {list?.name || "Lista de Favoritos"}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: { xs: "16px", sm: "24px" } }}>
        <Grid container spacing={3} justifyContent="center">
          {mangas?.length > 0 ? (
            mangas.map((manga) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={manga._id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    backgroundColor: "#1c1c1c",
                    color: "#fff",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    position: "relative",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
                    },
                  }}
                  onClick={() => handleMangaClick(manga._id)}
                >
                  <IconButton
                    sx={{
                      position: "absolute",
                      right: 5,
                      top: 5,
                      color: "#FF0037",
                      boxShadow: "0 8px 16px rgba(0.2, 0.2, 0.2, 1)",
                      borderRadius: "120px",
                      padding: "2px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveManga(manga._id);
                    }}
                  >
                    <DeleteForeverIcon />
                  </IconButton>

                  <CardMedia
                    component="img"
                    image={manga.image}
                    alt={`Capa do mangá ${manga.title}`}
                    sx={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />

                  <CardContent sx={{ textAlign: "center", padding: "16px" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "8px" }}>
                      {manga.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
                      {manga.genres?.length > 0 ? manga.genres.join(", ") : "Gêneros não disponíveis"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" sx={{ color: "#fff", textAlign: "center", marginTop: "16px" }}>
              Nenhum mangá na lista.
            </Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default FavoriteListDetails;
