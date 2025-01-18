import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MangaList from "../components/MangaList";
import { Box, Typography, CircularProgress, Container } from "@mui/material";
import MangaContext from "../contexts/MangaContext";
import { fetchAuthorById } from "../../services/api";

function CatalogPage() {
  const { mangas, loading, error } = useContext(MangaContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [mangasWithAuthors, setMangasWithAuthors] = useState([]);
  const navigate = useNavigate();

  const handleMangaClick = (id) => {
    navigate(`/manga/${id}`);
  };

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const updatedMangas = await Promise.all(
          mangas.map(async (manga) => {
            const author = manga.authorId
              ? await fetchAuthorById(manga.authorId)
              : null;

            return {
              ...manga,
              author: author ? author.name : "Autor desconhecido",
            };
          })
        );
        setMangasWithAuthors(updatedMangas);
      } catch (error) {
        console.error("Erro ao buscar autores:", error.message);
        setMangasWithAuthors(mangas.map((manga) => ({
          ...manga,
          author: "Erro ao carregar autor",
        })));
      }
    };

    if (mangas?.length > 0) {
      fetchAuthors();
    }
  }, [mangas]);

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
    return <Typography>{error}</Typography>;
  }

  const filteredMangas = mangasWithAuthors.filter((manga) => {
    const search = searchTerm.toLowerCase();

    return (
      manga.id?.toString().includes(search) || // Check if id exists
      manga.title?.toLowerCase().includes(search) || // Check if title exists
      manga.author?.toLowerCase().includes(search) || // Check if author exists
      manga.genres?.some((genre) => genre.toLowerCase().includes(search)) || // Check if genres exist
      manga.demographic?.toLowerCase().includes(search) // Check if demographic exists
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
