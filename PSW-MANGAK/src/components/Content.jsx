import PropTypes from "prop-types";
import { Box, Typography, Rating } from "@mui/material";
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import styles from "./Content.module.css";

const Content = ({ manga }) => {

  const status = manga.status ? manga.status.toUpperCase() : "indefinido"; 

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

  return (
    <Box className={styles.contentContainer}>
      <Box sx={{ display: "flex", flexDirection: "row", gap: "1em" }}>
        <img src={manga.image} alt={manga.title} className={styles.image} />
        <Box className={styles.detailsContainer}>
          <Typography variant="h6" className={styles.manga_name}>
            {manga.title}
          </Typography>
          <Typography variant="body2" className={styles.author}>
            {manga.author}
          </Typography>
          <Box sx={{ display: "flex", gap: "4px", justifyContent: "space-space-around",marginTop: "0.5em"}}>
            <Rating
              name="size-small"
              defaultValue={manga.rating || 2}
              size="small"
              sx={{
                "& .MuiRating-iconEmpty": { color: "#777" },
                "& .MuiRating-iconFilled": { color: "#EC7C01" },
                "& .MuiRating-iconHover": { color: "#FFA500" },
              }}
            />
            <Typography variant="body2" sx={{ fontSize: "var(--font-size-body)", color: "var(--text-color)", display: "flex" }}>
              <TurnedInNotIcon sx={{ height: "18px" }} />
              {manga.saved}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", margin: "8px 0px 8px 0px" }}>
        <span
          className={styles.statusDot}
          style={{ color: getStatusColor() }}
        >
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
    rating: PropTypes.number,
    saved: PropTypes.number,
    yearPubli: PropTypes.string,
    status: PropTypes.string, // Não é mais obrigatório
  }).isRequired,
};

export default Content;