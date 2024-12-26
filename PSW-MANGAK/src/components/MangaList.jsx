import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewTwoToneIcon from "@mui/icons-material/ArrowBackIosNewTwoTone";
import ArrowForwardIosTwoToneIcon from "@mui/icons-material/ArrowForwardIosTwoTone";

const groupByGenres = (mangas) =>
  mangas.reduce((groups, manga) => {
    const genres = manga.genres || [];
    genres.forEach((genre) => {
      if (!groups[genre]) groups[genre] = [];
      groups[genre].push(manga);
    });
    return groups;
  }, {});

const MangaList = ({ mangas, searchTerm, onMangaClick }) => {
  const listRefs = useRef({});
  const [scrollPositions, setScrollPositions] = useState({});
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  const groupedMangas = useMemo(() => groupByGenres(mangas), [mangas]);

  const filteredMangas = useMemo(
    () =>
      mangas.filter(
        (manga) =>
          manga.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          manga.author.toLowerCase().includes(lowerCaseSearchTerm) ||
          (manga.demographic &&
            manga.demographic.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (manga.genres &&
            manga.genres.some((genre) =>
              genre.toLowerCase().includes(lowerCaseSearchTerm)
            ))
      ),
    [mangas, lowerCaseSearchTerm]
  );

  const genresToDisplay = useMemo(() => {
    const exactGenreMatch = Object.keys(groupedMangas).find(
      (genre) => genre.toLowerCase() === lowerCaseSearchTerm
    );

    return exactGenreMatch
      ? { [exactGenreMatch]: groupedMangas[exactGenreMatch] }
      : groupByGenres(filteredMangas);
  }, [groupedMangas, lowerCaseSearchTerm, filteredMangas]);

  const updateScrollPositions = useCallback(() => {
    const updatedScrollPositions = {};
    Object.keys(genresToDisplay).forEach((genre) => {
      const listRef = listRefs.current[genre];
      if (listRef) {
        const canScrollLeft = listRef.scrollLeft > 0;
        const canScrollRight =
          Math.ceil(listRef.scrollLeft + listRef.clientWidth) <
          listRef.scrollWidth;

        updatedScrollPositions[genre] = {
          canScrollLeft,
          canScrollRight,
        };
      }
    });

    setScrollPositions((prev) => {
      const isEqual =
        JSON.stringify(prev) === JSON.stringify(updatedScrollPositions);
      return isEqual ? prev : updatedScrollPositions;
    });
  }, [genresToDisplay]);

  const handleScroll = useCallback(
    (genre, direction) => {
      const listRef = listRefs.current[genre];
      if (!listRef) return;

      const scrollAmount =
        direction === "left"
          ? -listRef.offsetWidth / 2
          : listRef.offsetWidth / 2;

      listRef.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });

      requestAnimationFrame(updateScrollPositions);
    },
    [updateScrollPositions]
  );

  useEffect(() => {
    updateScrollPositions();

    const handleResize = () => {
      updateScrollPositions();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateScrollPositions]);

  const arrowStyles = {
    position: "absolute",
    zIndex: 2,
    width: "50px",
    backgroundColor: "rgba(255, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  return (
    <Box sx={{ padding: "0 12px" }}>
      {Object.keys(genresToDisplay).length > 0 ? (
        Object.keys(genresToDisplay).map((genre) => (
          <Box
            key={genre}
            sx={{ marginBottom: { sx: "20px", md: "24px", lg: "28px" } }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "600",
                marginLeft: "2px",
                marginTop: { xs: "1.6em", md: "1.8em", lg: "2em" },
                marginBottom: { xs: "0.8em", md: "1em", lg: "1.2em" },
                fontSize: { xs: "1.6em", md: "1.8em", lg: "2em" },
                color: "#FFFFFF !important",
              }}
            >
              {genre}
            </Typography>
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                "@media (max-width: 600px)": {
                  "& .desktop-arrow": { display: "none" },
                },
              }}
            >
              {scrollPositions[genre]?.canScrollLeft && (
                <Box
                  className="desktop-arrow"
                  onClick={() => handleScroll(genre, "left")}
                  sx={{
                    ...arrowStyles,
                    left: 0,
                    height: { sm: "210px", md: "240px", lg: "300px" },
                    marginTop: "-24px",
                  }}
                >
                  <ArrowBackIosNewTwoToneIcon
                    sx={{ color: "white", fontSize: "20px" }}
                  />
                </Box>
              )}
              <Box
                ref={(el) => (listRefs.current[genre] = el)}
                sx={{
                  display: "flex",
                  gap: 3,
                  maxWidth: "100%",
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                  scrollSnapType: "x mandatory",
                  "::-webkit-scrollbar": { display: "none" },
                }}
                onScroll={() => requestAnimationFrame(updateScrollPositions)}
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
                      width: {
                        xs: "120px",
                        sm: "140px",
                        md: "160px",
                        lg: "200px",
                      },
                      margin: "8px 0",
                    }}
                  >
                    <AspectRatio
                      ratio="2/3"
                      sx={{ width: "100%", marginBottom: "24px" }}
                    >
                      <Box
                        component="img"
                        src={manga.image}
                        alt={manga.title}
                        loading="lazy"
                        sx={{
                          borderRadius: "8px",
                          height: "auto",
                          objectFit: "cover",
                        }}
                      />
                    </AspectRatio>
                  </Box>
                ))}
              </Box>
              {scrollPositions[genre]?.canScrollRight && (
                <Box
                  className="desktop-arrow"
                  onClick={() => handleScroll(genre, "right")}
                  sx={{
                    ...arrowStyles,
                    right: 0,
                    height: { sm: "210px", md: "240px", lg: "300px" },
                    marginTop: "-24px",
                  }}
                >
                  <ArrowForwardIosTwoToneIcon
                    sx={{ color: "white", fontSize: "20px" }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        ))
      ) : (
        <Typography sx={{ color: "#FFFFFF" }}>
          Nenhum resultado encontrado
        </Typography>
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
