import PropTypes from "prop-types"; 
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Typography from "@mui/material/Typography";

const groupByGenres = (mangas) => {
  return mangas.reduce((groups, manga) => {
    const genres = manga.genres || [];
    genres.forEach((genre) => {
      if (!groups[genre]) {
        groups[genre] = [];
      }
      groups[genre].push(manga);
    });
    return groups;
  }, {});
};

const MangaList = ({ mangas, searchTerm, onMangaClick }) => {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  // Filtrar mangás com base nos critérios de pesquisa: title, author, genres e demographic
  const filteredMangas = mangas.filter((manga) =>
    manga.title.toLowerCase().includes(lowerCaseSearchTerm) ||
    manga.author.toLowerCase().includes(lowerCaseSearchTerm) ||
    (manga.demographic && manga.demographic.toLowerCase().includes(lowerCaseSearchTerm)) ||
    (manga.genres && manga.genres.some((genre) => genre.toLowerCase().includes(lowerCaseSearchTerm)))
  );

  // Agrupar os mangás filtrados por gênero
  const groupedMangas = groupByGenres(filteredMangas);

  return (
    <Box>
      {Object.keys(groupedMangas).length > 0 ? (
        Object.keys(groupedMangas).map((genre) => (
          <Box key={genre} sx={{ marginBottom: "32px" }}>
            <Box sx={{ borderTop: "1px solid #444", width: "288px", marginBottom: "16px", alignSelf: "center" }}></Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                marginBottom: "12px",
                fontSize: "1em",
                color: "#FFFFFF !important",
              }}
            >
              {genre}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                maxWidth: "100%",
                overflowX: "auto",
                whiteSpace: "nowrap",
                scrollSnapType: "x mandatory",
                paddingLeft: "6px",
                "::-webkit-scrollbar": { display: "none" },
              }}
            >
              {groupedMangas[genre].map((manga) => (
                <Box
                  key={manga.id}
                  onClick={() => onMangaClick(manga.id)}
                  aria-label={`View details for ${manga.title}`}
                  sx={{
                    minWidth: { xs: 70, sm: 80 },
                    maxWidth: { xs: 100, sm: 110 },
                    cursor: "pointer",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    scrollSnapAlign: "center",
                    flexShrink: 0,
                  }}
                >
                  <AspectRatio ratio="2/3" sx={{ width: "100%" }}>
                    <img src={manga.image} alt={manga.title} style={{ borderRadius: "8px" }} />
                  </AspectRatio>
                </Box>
              ))}
            </Box>
          </Box>
        ))
      ) : (
        <Typography sx={{ color: "#FFFFFF" }}>Nenhum resultado encontrado</Typography>
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
      genres: PropTypes.arrayOf(PropTypes.string),
      demographic: PropTypes.string.isRequired,
    })
  ).isRequired,
  searchTerm: PropTypes.string.isRequired,
  onMangaClick: PropTypes.func.isRequired,
};

export default MangaList;