import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MangaList from "../components/MangaList";
import { Box, Typography, CircularProgress, Container } from "@mui/material";
import MangaContext from "../contexts/MangaContext";

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
        }}
      >
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );
  }

  if (error) {
    return <Typography>{error}</Typography>;
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
              <>
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
