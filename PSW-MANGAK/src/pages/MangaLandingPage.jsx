// MangaLandingPage.jsx
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
        bgcolor: "#000",
      }}
    >
      <Box
        sx={{
          width: "100%",
          bgcolor: "#000",
          padding: "16px",
          color: "#fff",
        }}
      >
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {manga && (
          <Content
            manga={{
              image: manga.image || "", // Valor padrão vazio caso a imagem esteja ausente
              title: manga.title || "Título Desconhecido",
              author: manga.author || "Autor Desconhecido",
              rating: manga.rating || 0,
              reviews: manga.reviews || 0,
              status: manga.status || "Status Desconhecido",
              yearPubli: manga.yearPubli || "????",
            }}
          />
        )}

        <Actions />

        {manga && <Description text={manga.description} />}

        {manga &&
          [
            { section: "Genres", tags: manga.tags || [] },
            { section: "Demographic", tags: [manga.demographic || ""] },
            { section: "Buy", tags: manga.buy || [] },
            { section: "Track", tags: manga.track || [] },
          ].map((data, index) => (
            <TagsSection key={index} data={data} />
          ))}

        <ArtGallery imagesList={manga?.imagesList || []} />
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
    reviews: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string.isRequired,
    yearPubli: PropTypes.string,
    demographic: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    imagesList: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    buy: PropTypes.arrayOf(PropTypes.string),
    track: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
};

export default MangaLandingPage;