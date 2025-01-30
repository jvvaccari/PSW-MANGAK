// src/pages/MangaLandingPage.jsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Typography, Container } from "@mui/material";

import { loadMangas } from "../redux/mangaSlice"; // Our new thunk
// Components
import Actions from "../components/Actions";
import ArtGallery from "../components/ArtGallery";
import Content from "../components/Content";
import Description from "../components/Description";
import Navbar from "../components/Navbar";
import TagsSection from "../components/TagsSection";

function MangaLandingPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { mangas, loading, error } = useSelector((state) => state.manga);

  useEffect(() => {
    // Only load if we haven't yet
    if (mangas.length === 0) {
      dispatch(loadMangas());
    }
  }, [dispatch, mangas.length]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "var(--bg-page-color)",
        }}
      >
        <CircularProgress />
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
          minHeight: "100vh",
          bgcolor: "var(--bg-page-color)",
        }}
      >
        <Typography color="error">Erro: {error}</Typography>
      </Box>
    );
  }
  console.log(id);
  console.log(mangas);
  const manga = mangas.find((m) => m._id === id);

  if (!manga) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "var(--bg-page-color)",
        }}
      >
        <Typography color="error">Mangá não encontrado.</Typography>
      </Box>
    );
  }

  const userId = user?.id;
  const tagsData = [
    { section: "Genres", tags: manga.genres || [] },
    { section: "Demographic", tags: [manga.demographic || "Indefinido"] },
  ];

  return (
    <>
      <Navbar />
      <Container maxWidth="xl">
        <Box
          sx={{
            padding: { xs: "16px", sm: "18px", md: "22px", lg: "32px" },
            color: "var(--text-color)",
            bgcolor: "var(--bg-page-color)",
          }}
        >
          <Content
            manga={{
              id: manga.id,
              image: manga.image || "",
              title: manga.title || "Título Desconhecido",
              authorId: manga.authorId || null,
              averageRating: parseFloat(manga.averageRating || 0),
              status: manga.status || "Status Desconhecido",
              yearPubli: manga.yearPubli || "????",
            }}
            userId={userId}
          />

          <Actions
            sx={{
              marginBottom: "var(--spacing-large)",
            }}
            mangaId={manga.id}
          />

          {manga.description && (
            <Description
              text={manga.description}
              sx={{
                fontSize: "var(--font-size-body)",
                marginBottom: "var(--spacing-large)",
              }}
            />
          )}

          {tagsData.map((data, index) => (
            <TagsSection
              key={index}
              data={data}
              sx={{
                marginBottom: "var(--spacing-medium)",
              }}
            />
          ))}

          {manga.retail && (
            <TagsSection
              data={{
                section: "Where to Buy",
                tags: manga.retail.map((item) => ({
                  name: item.name,
                  url: item.url,
                })),
              }}
              sx={{
                marginBottom: "var(--spacing-medium)",
              }}
            />
          )}

          {manga.artsList && <ArtGallery artsList={manga.artsList} />}
        </Box>
      </Container>
    </>
  );
}

export default MangaLandingPage;
