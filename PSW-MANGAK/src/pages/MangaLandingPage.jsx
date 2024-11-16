import Actions from "../components/Actions";
import ArtGallery from "../components/ArtGallery";
import Content from "../components/Content";
import Description from "../components/Description";
import Header from "../components/Header";
import TagsSection from "../components/TagsSection";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

function MangaLandingPage({ searchTerm, setSearchTerm, manga }) {
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
          padding: {xs: "16px",sm: "18px",md: "22px",lg: "32px"},
          color: "var(--text-color)",
          bgcolor: "var(--bg-page-color)",
        }}
      >
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {manga && (
          <Content
            manga={{
              image: manga.image || "",
              title: manga.title || "Título Desconhecido",
              author: manga.author || "Autor Desconhecido",
              rating: manga.rating || 0,
              status: manga.status || "Status Desconhecido",
              yearPubli: manga.yearPubli || "????",
            }}
            sx={{
              marginBottom: "var(--spacing-large)",
            }}
          />
        )}

        <Actions
          sx={{
            marginBottom: "var(--spacing-large)", // Margem padrão
          }}
        />

        {manga && (
          <Description
            text={manga.description}
            sx={{
              fontSize: "var(--font-size-body)",
              marginBottom: "var(--spacing-large)",
            }}
          />
        )}

        {manga &&
          [
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

        <ArtGallery
          artsList={manga?.artsList || []}
          sx={{
            display: "flex",
            flexWrap: "wrap", // Permite quebra de linha para imagens grandes
            justifyContent: "center",
            gap: "var(--spacing-small)", // Espaçamento entre imagens
            marginTop: "var(--spacing-medium)", // Margem superior padrão
          }}
        />
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
  }).isRequired,
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
};

export default MangaLandingPage;