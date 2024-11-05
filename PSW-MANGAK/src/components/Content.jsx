import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography, Rating } from "@mui/material";
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import styles from "./Content.module.css";

const Content = ({ mangaImage, title, author, rating, reviews, statusDot, publication }) => {
  const [userRating, setUserRating] = React.useState(rating / 2); // Inicializa o rating

  const handleRatingChange = (event, newValue) => {
    setUserRating(newValue);
    console.log(`User rating: ${newValue * 2}`); // Aqui você pode salvar o rating ou fazer outra ação
  };

  return (
    <Box className={styles.container}>
      <Box sx={{ display: "flex", flexDirection: "row", gap: "1em" }}>
        <img src={mangaImage} alt={title} />
        <Box className={styles.mangaData}>
          <Typography variant="h6" className={styles.manga_name}>
            {title}
          </Typography>
          <Typography variant="body2" className={styles.author}>
            {author}
          </Typography>
          <Box sx={{ display: "flex", gap: "4px", marginTop: "3.6em" }}>
            <Rating 
              name="manga-rating" 
              value={userRating} // Usa o state para controlar o valor
              precision={0.5} // Permite classificações intermediárias (meias estrelas)
              onChange={handleRatingChange} // Captura o valor selecionado pelo usuário
              size="small"
              sx={{
                "& .MuiRating-iconEmpty": {
                  color: "#777",
                },
                "& .MuiRating-iconFilled": {
                  color: "#EC7C01",
                },
                "& .MuiRating-iconHover": {
                  color: "#FFA500",
                },
              }}
            />
            <Typography variant="body2" sx={{ fontSize: "var(--font-size-body)", color: "var(--text-color)", display: "flex" }}>
              <TurnedInNotIcon sx={{ height: "18px" }} />
              {reviews}
            </Typography> 
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", margin: "12px 0px 6px 0px" }}>
        <span className={styles.statusDot}>{statusDot}</span>
        <Typography variant="caption">
          {publication}
        </Typography>
      </Box>
    </Box>
  );
};

Content.propTypes = {
  mangaImage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired, // Agora aceita somente números para facilitar o cálculo
  reviews: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  statusDot: PropTypes.string.isRequired,
  publication: PropTypes.string.isRequired,
};

export default Content;
