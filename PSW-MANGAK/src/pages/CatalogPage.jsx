// src/pages/CatalogPage.jsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Container } from "@mui/material";

import Navbar from "../components/Navbar";
import MangaList from "../components/MangaList";
import { loadMangas } from "../redux/mangaSlice"; // Redux thunk
import { fetchAuthorById } from "../../services/api"; // If you still want to fetch authors individually

function CatalogPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux manga state
  const { mangas, loading, error } = useSelector((state) => state.manga);

  // Local state for search and authors
  const [searchTerm, setSearchTerm] = useState("");
  const [mangasWithAuthors, setMangasWithAuthors] = useState([]);

  // Initially load if we have no mangas
  useEffect(() => {
    if (mangas.length === 0) {
      dispatch(loadMangas());
    }
  }, [dispatch, mangas.length]);

  // Once we have mangas, optionally fetch each manga's author
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const updatedMangas = await Promise.all(
          mangas.map(async (manga) => {
            if (manga.authorId) {
              const author = await fetchAuthorById(manga.authorId);
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

    if (mangas && mangas.length > 0) {
      fetchAuthors();
    }
  }, [mangas]);

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
        }}
      >
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

  // Filter by searchTerm
  const filteredMangas = mangasWithAuthors.filter((manga) => {
    const search = searchTerm.toLowerCase();
    return (
      manga.id.toString().includes(search) ||
      manga.title.toLowerCase().includes(search) ||
      manga.author.toLowerCase().includes(search) ||
      (manga.genres || []).some((genre) =>
        genre.toLowerCase().includes(search)
      ) ||
      (manga.demographic || "").toLowerCase().includes(search)
    );
  });

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
              color: "#fff",
            }}
          >
            {filteredMangas.length > 0 ? (
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
                }}
              >
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
