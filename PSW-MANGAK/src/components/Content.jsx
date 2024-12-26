import PropTypes from "prop-types";
import { Box, Typography, Rating, Button } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import { useNavigate } from "react-router-dom";
import styles from "./Content.module.css";

const Content = ({ manga, userId, onRate }) => {
  const navigate = useNavigate();

  // Funções auxiliares
  const calculateAverageRating = (ratings = []) =>
    ratings.length
      ? (
          ratings.reduce((acc, item) => acc + (item?.rating || 0), 0) /
          ratings.length
        ).toFixed(1)
      : "0.0";

  const getUserRating = (ratings = []) =>
    ratings.find((item) => item?.userId === userId)?.rating || null;

  const statusColors = {
    "EM ANDAMENTO": "#40FF00",
    "EM HIATO": "#FFE100",
    FINALIZADO: "#FF0000",
    default: "#777",
  };

  const handleRatingChange = (event, newRating) => {
    if (!userId) {
      console.error("Erro: Usuário não autenticado. Não é possível avaliar.");
      return;
    }
    if (onRate && newRating) {
      onRate(userId, newRating);
    } else {
      console.warn("Erro ao enviar avaliação: Callback `onRate` não definido.");
    }
  };

  const handleViewComments = () => {
    if (!userId) {
      console.warn("Usuário não autenticado.");
      return;
    }
    navigate(`/comments/${manga.id}`);
  };

  const averageRating = calculateAverageRating(manga.ratings);
  const userRating = getUserRating(manga.ratings);
  const status = manga.status?.toUpperCase() || "INDEFINIDO";
  const statusColor = statusColors[status] || statusColors.default;

  const ratingStyles = {
    "& .MuiRating-iconEmpty": { color: "#777" },
    "& .MuiRating-iconFilled": { color: "#EC7C01" },
    "& .MuiRating-iconHover": { color: "#FFA500" },
    fontSize: { xs: "1em", sm: "1.1em", md: "1.2em", lg: "1.4em" },
  };

  const imageStyles = {
    width: "50%",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
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
          alt={`Capa de ${manga.title}`}
          sx={imageStyles}
        />
        <Box className={styles.detailsContainer}>
          <Typography variant="h3">{manga.title}</Typography>
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
              mt: { xs: 1, md: 1.2 },
            }}
          >
            <Rating
              name="rating-controlled"
              value={userRating || 0}
              precision={0.5}
              size="small"
              onChange={handleRatingChange}
              sx={ratingStyles}
            />
            <Typography variant="body2" sx={{ color: "var(--text-color)" }}>
              {`(${averageRating})`}
            </Typography>
            <Button
              variant="text"
              onClick={handleViewComments}
              sx={{
                display: "flex",
                alignItems: "center",
                color: "var(--text-color)",
                textTransform: "none",
                fontSize: { xs: "1em", sm: "1.2em", md: "1.4em" },
              }}
            >
              <CommentIcon sx={{ ml: "12px" }} />
            </Button>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mt: "0.5em" }}>
        <span
          className={styles.statusDot}
          style={{
            color: statusColor,
            fontSize: "1.8em",
            marginRight: "0.2em",
            marginTop: "-2px",
          }}
        >
          •
        </span>
        <Typography variant="caption">
          {`PUBLICAÇÃO: ${manga.yearPubli || "????"}, ${status}`}
        </Typography>
      </Box>
    </Box>
  );
};

Content.propTypes = {
  manga: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    ratings: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
      })
    ),
    yearPubli: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  userId: PropTypes.string,
  onRate: PropTypes.func,
};

export default Content;
