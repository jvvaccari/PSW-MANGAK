import PropTypes from "prop-types"; // Importar PropTypes
import { Card, CardMedia, CardContent, Typography } from "@mui/material";

const MangaCard = ({ manga, onClick }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        bgcolor: "#333",
        color: "#fff",
        ":hover": { transform: "scale(1.05)", transition: "0.3s ease" },
      }}
    >
      <CardMedia
        component="img"
        image={manga.image}
        alt={manga.title}
        sx={{ height: "200px", objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="h6">{manga.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {manga.genres.join(", ")}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Adicionar validação de `props` com PropTypes
MangaCard.propTypes = {
  manga: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    genres: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MangaCard;
