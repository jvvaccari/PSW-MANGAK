import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Box, Typography, Rating } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import { useNavigate } from "react-router-dom";
import { fetchAuthorById, fetchEvaluations } from "../../services/api";
import styles from "./Content.module.css";

const Content = ({ manga, userId }) => {
  const navigate = useNavigate();
  const [authorName, setAuthorName] = useState("Carregando autor...");
  const [averageRating, setAverageRating] = useState(0.0);
  const [ratingsCount, setRatingsCount] = useState(0);

  // Buscar autor com base no authorId
  useEffect(() => {
    if (manga.authorId) {
      fetchAuthorById(manga.authorId)
        .then((author) => {
          setAuthorName(author?.name || "Autor desconhecido");
        })
        .catch(() => {
          setAuthorName("Erro ao carregar autor");
        });
    } else {
      setAuthorName("Autor desconhecido");
    }
  }, [manga.authorId]);

  // Buscar e calcular média das avaliações
  useEffect(() => {
    if (manga.id) {
      fetchEvaluations(manga.id)
      .then((evaluations) => {
        if (evaluations.length > 0) {
          const totalRatings = evaluations.reduce((acc, evaluation) => acc + evaluation.rating, 0);
          const average = totalRatings / evaluations.length;
          setAverageRating(parseFloat(average.toFixed(1)));
          setRatingsCount(evaluations.length);
        }
      })
      
        .catch(() => {
          setAverageRating(0.0);
          setRatingsCount(0);
        });
    }
  }, [manga.id]);

  const statusColors = {
    "EM ANDAMENTO": "#40FF00",
    "EM HIATO": "#FFE100",
    FINALIZADO: "#FF0000",
    default: "#777",
  };

  const handleViewComments = () => {
    if (!userId) {
      console.warn("Usuário não autenticado.");
      return;
    }
    navigate(`/evaluations/${manga.id}/${userId}`);
  };

  const status = manga.status?.toUpperCase() || "INDEFINIDO";
  const statusColor = statusColors[status] || statusColors.default;

  const ratingStyles = {
    "& .MuiRating-iconEmpty": { color: "#777" },
    "& .MuiRating-iconFilled": { color: "#EC7C01" },
    fontSize: { xs: "1em", sm: "1.1em", md: "1.2em", lg: "1.4em" },
  };

  const clickableStyles = {
    cursor: "pointer",
    ":hover": {
      color: "#FF0000",
    },
  };

  const imageStyles = {
    width: "50%",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    objectFit: "cover",
  };

  return (
    <Box className={styles.contentContainer}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: "1em", md: "1.4em" },
          mt: { xs: "1.2em", md: "1.8em" },
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
            {authorName}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              mt: { xs: 1, md: 1.2 },
            }}
          >
            <Rating
              name="average-rating"
              value={averageRating}
              precision={0.1}
              readOnly
              sx={ratingStyles}
            />
            <Typography variant="body2" sx={{ color: "var(--text-color)" }}>
              {`(${averageRating})`}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                ...clickableStyles,
              }}
              onClick={handleViewComments}
            >
              <CommentIcon sx={{ marginLeft: 1.4 }} />
            </Box>
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
    authorId: PropTypes.string,
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
};

export default Content;
