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
import { updateManga } from "../../services/api";
import useAuth from "../contexts/useAuth";


const MangaLandingPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const { mangas, loading, error, setMangas } = useContext(MangaContext);

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

  // Sanitiza o array de ratings para garantir que todos os itens sejam objetos válidos
  const sanitizedRatings = (manga.ratings || [])
    .filter((rating) => typeof rating === "object" && rating !== null) // Exclui valores inválidos
    .map((rating) => ({
      userId: rating.userId || "unknown",
      rating: rating.rating || 0,
    }));

    const handleRatingUpdate = async (userId, newRating) => {
      try {
        const updatedRatings = [...(manga.ratings || [])];
        const existingRatingIndex = updatedRatings.findIndex(
          (rating) => rating.userId === userId
        );
    
        if (existingRatingIndex >= 0) {
          // Atualiza a avaliação existente
          updatedRatings[existingRatingIndex].rating = newRating;
        } else {
          // Adiciona nova avaliação com o ID real do usuário
          updatedRatings.push({ userId: userId, rating: newRating });
        }
    
        const updatedManga = {
          ...manga,
          ratings: updatedRatings,
        };
    
        await updateManga(id, updatedManga);
        setMangas((prevMangas) =>
          prevMangas.map((m) => (m.id === id ? updatedManga : m))
        );
      } catch (error) {
        console.error("Erro ao atualizar avaliação:", error);
      }
    };    

  const averageRating = sanitizedRatings.length > 0
    ? sanitizedRatings.reduce((total, item) => total + (item?.rating || 0), 0) /
      sanitizedRatings.length
    : 0;

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
            ratings: sanitizedRatings, // Array sanitizado
            rating: averageRating, // Média calculada
          }}
          userId={user.id} // Passa apenas o ID do usuário autenticado
          onRate={handleRatingUpdate} // Função para atualizar a avaliação
          sx={{
            marginBottom: { xs: "16px", sm: "20px", md: "24px" },
          }}
        />

        <Actions
          sx={{
            marginBottom: { xs: "16px", sm: "20px", md: "24px" },
          }}
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
        ].map((data, index) => (
          <TagsSection
            key={index}
            data={data}
            sx={{
              marginBottom: { xs: "12px", sm: "16px", md: "20px" },
              fontSize: { xs: "12px", sm: "14px", md: "16px" },
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
              gap: { xs: "8px", sm: "12px", md: "16px" },
              marginTop: { xs: "16px", sm: "20px", md: "24px" },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default MangaLandingPage;