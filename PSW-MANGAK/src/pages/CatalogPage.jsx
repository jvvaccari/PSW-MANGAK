import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Container } from "@mui/material";

import Navbar from "../components/Navbar";
import MangaList from "../components/MangaList";
import { loadMangas } from "../redux/mangaSlice";
import * as api from "../../services/api";

function CatalogPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mangas = [], loading, error } = useSelector((state) => state.manga || {});
  const [searchTerm, setSearchTerm] = useState("");
  const [mangasWithAuthors, setMangasWithAuthors] = useState([]);

  useEffect(() => {
    if (mangas.length === 0) {
      dispatch(loadMangas());
    }
  }, [dispatch, mangas.length]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const updatedMangas = await Promise.all(
          mangas.map(async (manga) => {
            if (manga.authorId) {
              const author = await api.fetchAuthorById(manga.authorId);
              return {
                ...manga,
                author: author ? author.name : "Autor desconhecido",
              };
            } else {
              return { ...manga, author: "Autor desconhecido" };
            }
          })
        );
        setMangasWithAuthors(updatedMangas);
      } catch (err) {
        console.error("Erro ao buscar autores:", err.message);
        setMangasWithAuthors(
          mangas.map((m) => ({
            ...m,
            author: "Erro ao carregar autor",
          }))
        );
      }
    };

    if (mangas.length > 0) {
      fetchAuthors();
    }
  }, [mangas]);

  const handleMangaClick = (id) => {
    navigate(`/manga/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const filteredMangasWithSearch = mangasWithAuthors.filter((manga) => {
    const search = searchTerm.toLowerCase();
    return (
      (manga.id && manga.id.toString().includes(search)) ||
      manga.title.toLowerCase().includes(search) ||
      manga.author.toLowerCase().includes(search) ||
      (manga.genres || []).some((genre) => genre.toLowerCase().includes(search)) ||
      (manga.demographic || "").toLowerCase().includes(search)
    );
  });  

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Container maxWidth="xxl">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh", bgcolor: "#000" }}>
          <Box sx={{ width: "100%", maxWidth: "100vw", bgcolor: "#000", color: "#fff" }}>
            {filteredMangasWithSearch.length > 0 ? (
              <MangaList mangas={filteredMangasWithSearch} searchTerm={searchTerm} onMangaClick={handleMangaClick} horizontalScroll />
            ) : (
              <Typography variant="subtitle1" sx={{ marginTop: { xs: "0.5em", sm: "0.8em", lg: "2em" }, fontWeight: 700, fontSize: { xs: "1.2em", md: "1.4em", lg: "1.6em" } }}>
                Nenhum mangá encontrado
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default CatalogPage;
