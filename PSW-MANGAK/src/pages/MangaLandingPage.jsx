import { useContext } from "react";
import { useParams } from "react-router-dom";
import MangaContext from "../contexts/MangaContext";
import Actions from "../components/Actions";
import ArtGallery from "../components/ArtGallery";
import Content from "../components/Content";
import Description from "../components/Description";
import Header from "../components/Header";
import TagsSection from "../components/TagsSection";
import { Box, CircularProgress, Typography } from "@mui/material";
import useAuth from "../contexts/useAuth";

function MangaLandingPage() {
  const { id } = useParams();
  const { mangas, loading, error } = useContext(MangaContext);
  const { user } = useAuth();
  const userId = user?.id;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "var(--bg-page-colorr)",
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

  const manga = mangas.find((m) => m.id === id);

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

  const handleRate = (userId, rating) => {
    console.log(`Usuário ${userId} avaliou com nota ${rating}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        bgcolor: "var(--bg-page-color)",
      }}
    >
      <Box
        sx={{
          padding: { xs: "16px", sm: "18px", md: "22px", lg: "32px" },
          color: "var(--text-color)",
          bgcolor: "var(--bg-page-color)",
        }}
      >
        <Header />

        <Content
          manga={{
            id: manga.id || "ID Desconhecido",
            image: manga.image || "",
            title: manga.title || "Título Desconhecido",
            author: manga.author || "Autor Desconhecido",
            ratings: manga.ratings || [],
            status: manga.status || "Status Desconhecido",
            yearPubli: manga.yearPubli || "????",
          }}
          userId={userId}
          onRate={handleRate}
          sx={{
            marginBottom: "var(--spacing-large)",
          }}
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

        {[
          { section: "Genres", tags: manga.genres || [] },
          { section: "Demographic", tags: [manga.demographic || ""] },
          { section: "Buy", tags: manga.retail || [] },
        ].map((data, index) => (
          <TagsSection
            key={index}
            data={data}
            sx={{
              marginBottom: "var(--spacing-medium)",
            }}
          />
        ))}

        {manga.artsList && (
          <ArtGallery
            artsList={manga.artsList || []}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "var(--spacing-small)",
              marginTop: "var(--spacing-medium)",
            }}
          />
        )}
      </Box>
    </Box>
  );
}

export default MangaLandingPage;