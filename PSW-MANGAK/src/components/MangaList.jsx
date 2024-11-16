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

  const groupedMangas = groupByGenres(mangas);

  const exactGenreMatch = Object.keys(groupedMangas).find(
    (genre) => genre.toLowerCase() === lowerCaseSearchTerm
  );

  const filteredMangas = mangas.filter((manga) =>
    manga.title.toLowerCase().includes(lowerCaseSearchTerm) ||
    manga.author.toLowerCase().includes(lowerCaseSearchTerm) ||
    (manga.demographic && manga.demographic.toLowerCase().includes(lowerCaseSearchTerm)) ||
    (manga.genres && manga.genres.some((genre) => genre.toLowerCase().includes(lowerCaseSearchTerm)))
  );

  const genresToDisplay = exactGenreMatch ? { [exactGenreMatch]: groupedMangas[exactGenreMatch] } : groupByGenres(filteredMangas);

  return (
    <Box>
      {Object.keys(genresToDisplay).length > 0 ? (
        Object.keys(genresToDisplay).map((genre) => (
          <Box key={genre} sx={{ marginBottom: {sx: "20px",md: "24px",lg: "28px"} }}>
            <Box sx={{ borderTop: "0.1px solid #444", width: "99.5%", marginBottom: {xs:"12px",md:"16px",lg:"20px"}, alignSelf: "center"}}></Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                marginTop: {xs:"14px",md:"18px",lg:"28px"},
                marginBottom: {xs:"8px",md:"12px",lg:"16px"},
                fontSize: {xs:"1em",md: "1.2em",lg: "1.4em"},
                color: "#FFFFFF !important",
              }}
            >
              {genre}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 3,
                maxWidth: "100%",
                overflowX: "auto",
                whiteSpace: "nowrap",
                scrollSnapType: "x mandatory",
                paddingLeft: "6px",
                "::-webkit-scrollbar": { display: "none" },
              }}
            >
              {genresToDisplay[genre].map((manga) => (
                <Box
                  key={manga.id}
                  onClick={() => onMangaClick(manga.id)}
                  aria-label={`View details for ${manga.title}`}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    borderRadius: "8px",
                    scrollSnapAlign: "center",
                    flexShrink: 0,
                    width: { xs: "28%", sm: "22%", md: "18%" },
                    maxWidth: "150px",
                    margin: "8px 0",
                  }}
                >
                  <AspectRatio ratio="2/3" sx={{ width: "100%" , marginBottom: "24px"}}>
                    <Box  
                      component="img"
                      src={manga.image}
                      alt={manga.title}
                      sx={{
                        borderRadius: "8px",
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                      }}
                    />
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