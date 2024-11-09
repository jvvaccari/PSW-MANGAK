import PropTypes from "prop-types";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";

const MangaList = ({ mangas, searchTerm, onMangaClick, horizontalScroll = false }) => {
  const filteredMangas = mangas.filter((manga) =>
    manga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manga.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: horizontalScroll ? "flex-start" : "center",
        gap: 2,
        maxWidth: "100%", // Limitar a largura da lista para caber no contêiner
        overflowX: horizontalScroll ? "auto" : "visible",
        whiteSpace: horizontalScroll ? "nowrap" : "normal",
        scrollSnapType: horizontalScroll ? "x mandatory" : "none",
        padding: "0 12px",
        "::-webkit-scrollbar": { display: "none" },
        margin: "32px 0px",
      }}
    >
      {filteredMangas.length > 0 ? (
        filteredMangas.map((manga) => (
          <Box
            key={manga.id}
            onClick={() => onMangaClick(manga.id)}
            sx={{
              minWidth: 80,
              maxWidth: 110,
              cursor: "pointer",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              scrollSnapAlign: horizontalScroll ? "center" : "unset",
              flexShrink: 0, // Impedir que o item de mangá encolha
            }}
          >
            <AspectRatio ratio="2/3" sx={{ width: "100%" }}>
              <img src={manga.image} alt={manga.title} />
            </AspectRatio>
          </Box>
        ))
      ) : (
        <p>Nenhum mangá encontrado</p>
      )}
    </Box>
  );
};

MangaList.propTypes = {
  mangas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  searchTerm: PropTypes.string.isRequired,
  onMangaClick: PropTypes.func.isRequired,
  horizontalScroll: PropTypes.bool,
};

export default MangaList;