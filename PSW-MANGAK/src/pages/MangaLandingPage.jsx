import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MangaContext from "../contexts/MangaContext";
import Actions from "../components/Actions";
import ArtGallery from "../components/ArtGallery";
import Content from "../components/Content";
import Description from "../components/Description";
import Header from "../components/Header";
import TagsSection from "../components/TagsSection";
import { Box, CircularProgress, Typography } from "@mui/material";
import { updateManga } from "../../services/api";
import useAuth from "../contexts/useAuth";

const MangaLandingPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const { mangas, loading, error, setMangas } = useContext(MangaContext);
  const [artsLoading, setArtsLoading] = useState(true); // Estado de carregamento das artes

  const manga = mangas.find((m) => m.id === id);

  useEffect(() => {
    if (manga?.artsList?.length) {
      // Cria uma lista de promessas para carregar todas as imagens
      const imagePromises = manga.artsList.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = resolve; // Evita erro caso alguma imagem não carregue
          })
      );

      Promise.all(imagePromises).then(() => {
        setArtsLoading(false); // Todas as imagens carregadas
      });
    } else {
      setArtsLoading(false); // Não há artes para carregar
    }
    window.scrollTo(0, 0);
  }, [manga]);

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

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    return (
      ratings.reduce((total, item) => total + (item.rating || 0), 0) /
      ratings.length
    );
  };

  const sanitizedRatings = (manga.ratings || []).filter(
    (rating) => typeof rating === "object" && rating !== null
  );

  const handleRatingUpdate = async (userId, newRating) => {
    try {
      const updatedRatings = [...(manga.ratings || [])];
      const existingRatingIndex = updatedRatings.findIndex(
        (rating) => rating.userId === userId
      );

      if (existingRatingIndex >= 0) {
        updatedRatings[existingRatingIndex].rating = newRating;
      } else {
        updatedRatings.push({ userId, rating: newRating });
      }

      const updatedManga = { ...manga, ratings: updatedRatings };

      await updateManga(id, updatedManga);
      setMangas((prevMangas) =>
        prevMangas.map((m) => (m.id === id ? updatedManga : m))
      );
    } catch (error) {
      console.error("Erro ao atualizar avaliação:", error);
    }
  };

  const averageRating = calculateAverageRating(sanitizedRatings);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        bgcolor: "var(--bg-page-color)",
        padding: { xs: "16px", sm: "20px", md: "24px", lg: "32px" },
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          width: "100%",
          color: "var(--text-color)",
        }}
      >
        <Header />

        <Content
          manga={{
            ...manga,
            ratings: sanitizedRatings,
            rating: averageRating,
          }}
          userId={user?.id || "guest"}
          onRate={handleRatingUpdate}
          sx={{ marginBottom: { xs: "16px", sm: "20px", md: "24px" } }}
        />

        <Actions
          sx={{ marginBottom: { xs: "16px", sm: "20px", md: "24px" } }}
          mangaId={manga.id}
        />

        {manga.description && (
          <Description
            text={manga.description}
            sx={{
              fontSize: { xs: "14px", sm: "16px", md: "18px" },
              lineHeight: { xs: "1.5", sm: "1.6", md: "1.8" },
              marginBottom: { xs: "16px", sm: "20px", md: "24px" },
            }}
          />
        )}

        {[{ section: "Genres", tags: manga.genres || [] },
          { section: "Demographic", tags: [manga.demographic || ""] },
          { section: "Buy", tags: manga.retail || [] },
        ].map(
          (data, index) =>
            data.tags.length > 0 && (
              <TagsSection
                key={index}
                data={data}
                sx={{
                  marginBottom: { xs: "12px", sm: "16px", md: "20px" },
                  fontSize: { xs: "12px", sm: "14px", md: "16px" },
                }}
              />
            )
        )}

        {artsLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          manga.artsList?.length > 0 && (
            <ArtGallery
              artsList={manga.artsList}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: { xs: "8px", sm: "12px", md: "16px" },
                marginTop: { xs: "16px", sm: "20px", md: "24px" },
              }}
            />
          )
        )}
      </Box>
    </Box>
  );
};

export default MangaLandingPage;