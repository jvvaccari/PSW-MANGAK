import PropTypes from "prop-types";
import { Box, Typography, Rating } from "@mui/material";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import styles from "./Content.module.css";

const calculateAverageRating = (ratings) => {
  if (!Array.isArray(ratings) || ratings.length === 0) return 0.0;
  const total = ratings.reduce((acc, item) => acc + (item?.rating || 0), 0);
  return (total / ratings.length).toFixed(1); // Retorna a média com uma casa decimal
};

const getUserRating = (ratings, userId) => {
  if (!Array.isArray(ratings) || !userId) return null;
  const userRating = ratings.find((item) => item?.userId === userId);
  return userRating ? userRating.rating : null;
};

const Content = ({ manga, userId, onRate }) => {
  const averageRating = calculateAverageRating(manga.ratings); // Calcula a média
  const userRating = getUserRating(manga.ratings, userId); // Avaliação do usuário

  const status = manga.status ? manga.status.toUpperCase() : "INDEFINIDO";

  const getStatusColor = () => {
    switch (status) {
      case "EM ANDAMENTO":
        return "#40FF00";
      case "EM HIATO":
        return "#FFE100";
      case "FINALIZADO":
        return "#FF0000";
      default:
        return "#777";
    }
  };

  const handleRatingChange = (event, newRating) => {
    if (!userId) {
      console.error("Erro: Usuário não autenticado. Não é possível avaliar.");
      return;
    }

    if (onRate && newRating) {
      onRate(userId, newRating); // Callback para enviar a avaliação ao backend
    } else {
      console.warn("Erro ao enviar avaliação: Callback `onRate` não definido.");
    }
  };

  return (
    <Box className={styles.contentContainer}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: { xs: "1em", md: "1.4em", lg: "1.8em" },
          marginTop: { xs: "1.2em", md: "1.4em", lg: "1.8em" },
        }}
      >
        <Box
          component="img"
          src={manga.image}
          alt={manga.title}
          sx={{ width: "50%" }}
        />
        <Box className={styles.detailsContainer}>
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: "1em", md: "1.2em", lg: "2em" } }}
          >
            {manga.title}
          </Typography>
          <Typography
            variant="body2"
            className={styles.author}
            sx={{ fontSize: { xs: "0.8em", md: "1em", lg: "1.4em" } }}
          >
            {manga.author}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginTop: { xs: "1em", md: "1.2em", lg: "1.4em" },
            }}
          >
            <Rating
              name="rating-controlled"
              value={userRating || 0}
              precision={0.5}
              size="small"
              onChange={handleRatingChange}
              sx={{
                "& .MuiRating-iconEmpty": { color: "#777" },
                "& .MuiRating-iconFilled": { color: "#EC7C01" },
                "& .MuiRating-iconHover": { color: "#FFA500" },
                fontSize: { xs: "1em", sm: "1.1em", md: "1.2em", lg: "1.4em" },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontSize: "var(--font-size-body)",
                color: "var(--text-color)",
              }}
            >
              {`(${averageRating})`} {/* Exibe a média das avaliações */}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "var(--font-size-body)",
                color: "var(--text-color)",
                display: "flex",
              }}
            >
              <TurnedInNotIcon
                sx={{
                  paddingTop: "1.2px",
                  fontSize: { xs: "1.4em", sm: "1.5em", md: "1.6em", lg: "1.8em" },
                }}
              />
              {manga.saved}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", marginTop: "0.5em" }}>
        <span className={styles.statusDot} style={{ color: getStatusColor() }}>
          •
        </span>
        <Typography variant="caption">
          {`PUBLICATION: ${manga.yearPubli || "????"}, ${status}`}
        </Typography>
      </Box>
    </Box>
  );
};

Content.propTypes = {
  manga: PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    ratings: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
      })
    ),
    saved: PropTypes.number,
    yearPubli: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  userId: PropTypes.string, // ID do usuário atual
  onRate: PropTypes.func, // Callback para enviar avaliação
};

export default Content;