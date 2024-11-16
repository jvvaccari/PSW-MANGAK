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
      <Box sx={{ display: "flex", flexDirection: "row", gap: "1em",marginTop: {xs: "1em",md: "1.2em",lg: "1.4em"} }}>
        <Box component="img" src={manga.image} alt={manga.title} sx={{width: "50%"}} />
        <Box className={styles.detailsContainer}>
          <Typography variant="h6" sx={{fontSize: {xs:"1em",md: "1.2em",lg: "2em"}}}>
            {manga.title}
          </Typography>
          <Typography variant="body2" className={styles.author} sx={{fontSize: {xs:"0.5em",md: "0.7em",lg: "1.4em"}}}>
            {manga.author}
          </Typography>
          <Box sx={{ display: "flex", gap: "6px", justifyContent: "space-space-around",marginTop: {xs: "1em",md: "1.2em",lg: "1.4em"}}}>
            <Rating
              name="size-small"
              defaultValue={manga.rating || 2}
              size="small"
              sx={{
                "& .MuiRating-iconEmpty": { color: "#777" },
                "& .MuiRating-iconFilled": { color: "#EC7C01" },
                "& .MuiRating-iconHover": { color: "#FFA500" },
                fontSize: {xs: "1em",sm: "1.1em",md: "1.2em",lg: "1.4em"}
              }}
            />
            <Typography variant="body2" sx={{ fontSize: "var(--font-size-body)", color: "var(--text-color)", display: "flex" }}>
              <TurnedInNotIcon sx={{paddingTop: "1.2px",fontSize: {xs: "1.4em",sm: "1.5em",md: "1.6em",lg: "1.8em"} }} />
              {manga.saved}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", margin: "8px 0px 8px 0px",marginTop: {xs: "1em",md: "1.2em",lg: "1.4em"}}}>
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
    status: PropTypes.string,
  }).isRequired,
};

export default Content;