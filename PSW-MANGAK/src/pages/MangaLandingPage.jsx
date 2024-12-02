import Actions from "../components/Actions";
import ArtGallery from "../components/ArtGallery";
import Content from "../components/Content";
import Description from "../components/Description";
import Header from "../components/Header";
import TagsSection from "../components/TagsSection";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

function MangaLandingPage({ manga }) {
  // Garantir que manga tenha valores válidos e utilizar valores padrão se necessário
  const safeManga = manga || {};  // Se manga for null ou undefined, utiliza um objeto vazio.

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        bgcolor: "var(--bg-color)",
      }}
    >
      <Box
        sx={{
          width: "var(--page-size)",
          padding: { xs: "16px", sm: "18px", md: "22px", lg: "32px" },
          color: "var(--text-color)",
          bgcolor: "var(--bg-page-color)",
        }}
      >
        <Header />

        {safeManga.id && (
          <Content
            manga={{
              image: safeManga.image || "",
              title: safeManga.title || "Título Desconhecido",
              author: safeManga.author || "Autor Desconhecido",
              rating: safeManga.rating || 0,
              status: safeManga.status || "Status Desconhecido",
              yearPubli: safeManga.yearPubli || "????",
            }}
            sx={{
              marginBottom: "var(--spacing-large)",
            }}
          />
        )}

        {safeManga.id && (
          <Actions
            sx={{
              marginBottom: "var(--spacing-large)",
            }}
            mangaId={safeManga.id}
          />
        )}

        {safeManga.description && (
          <Description
            text={safeManga.description}
            sx={{
              fontSize: "var(--font-size-body)",
              marginBottom: "var(--spacing-large)",
            }}
          />
        )}

        {safeManga.id &&
          [
            { section: "Genres", tags: safeManga.genres || [] },
            { section: "Demographic", tags: [safeManga.demographic || ""] },
            { section: "Buy", tags: safeManga.retail || [] },
          ].map((data, index) => (
            <TagsSection
              key={index}
              data={data}
              sx={{
                marginBottom: "var(--spacing-medium)",
              }}
            />
          ))}

        {safeManga.artsList && (
          <ArtGallery
            artsList={safeManga.artsList || []}
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

MangaLandingPage.propTypes = {
  manga: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    rating: PropTypes.number,
    status: PropTypes.string.isRequired,
    yearPubli: PropTypes.string,
    demographic: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.string),
    artsList: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    retail: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })
    ),
  }),
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
};

export default MangaLandingPage;