import { Box } from "@mui/material";
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import IosShareIcon from '@mui/icons-material/IosShare';
import styles from "./Actions.module.css";
import { useState, useEffect, useContext, useCallback } from "react";
import { fetchAccountById, updateAccount } from "../../services/api";
import PropTypes from "prop-types";
import UserContext from "../contexts/UserContext";

const Actions = ({ mangaId }) => {
  const { userId } = useContext(UserContext); 
  const [favorite, setFavorite] = useState(false);

  // Função para verificar se o manga está nos favoritos, memorizada com useCallback
  const checkIfFavorite = useCallback(async () => {
    try {
      const user = await fetchAccountById(userId);
      if (user && user.favorites.includes(mangaId)) {
        setFavorite(true);
      } else {
        setFavorite(false);
      }
    } catch (err) {
      console.error("Erro ao verificar favoritos:", err);
    }
  }, [userId, mangaId]);

  useEffect(() => {
    if (userId) {
      checkIfFavorite();
    }
  }, [userId, mangaId, checkIfFavorite]);  // Agora checkIfFavorite é uma dependência

  // Função para adicionar aos favoritos
  const handleAddToFavorites = async () => {
    try {
      const user = await fetchAccountById(userId);
      if (!user.favorites.includes(mangaId)) {
        const updatedFavorites = [...user.favorites, mangaId];
        console.log("Favoritos atualizados:", updatedFavorites);

        const updatedUser = await updateAccount(userId, { ...user, favorites: updatedFavorites });
        if (updatedUser) {
          setFavorite(true);
        }
      }
    } catch (err) {
      console.error("Erro ao adicionar aos favoritos:", err);
    }
  };

  // Função para remover dos favoritos
  const handleRemoveFromFavorites = async () => {
    try {
      const user = await fetchAccountById(userId);
      const updatedFavorites = user.favorites.filter((id) => id !== mangaId);
      console.log("Favoritos após remoção:", updatedFavorites);

      const updatedUser = await updateAccount(userId, { ...user, favorites: updatedFavorites });
      if (updatedUser) {
        setFavorite(false);
      }
    } catch (err) {
      console.error("Erro ao remover dos favoritos:", err);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: "8px" }}>
      {!favorite ? (
        <button className={styles.actionButton} onClick={handleAddToFavorites}>
          <BookmarkAddIcon className={styles.actionIcon} />
        </button>
      ) : (
        <button className={styles.actionButton} onClick={handleRemoveFromFavorites}>
          <BookmarkAddedIcon className={styles.actionIcon} />
        </button>
      )}
      <button className={styles.actionButton}>
        <IosShareIcon className={styles.actionIcon} />
      </button>
    </Box>
  );
};

Actions.propTypes = {
  mangaId: PropTypes.string.isRequired, // Certifique-se de que mangaId é passado como string
};

export default Actions;