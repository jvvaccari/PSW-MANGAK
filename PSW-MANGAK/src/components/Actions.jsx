import { Box } from "@mui/material";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import IosShareIcon from "@mui/icons-material/IosShare";
import styles from "./Actions.module.css";
import { useState, useEffect, useContext, useCallback } from "react";
import { fetchAccountById, updateAccount } from "../../services/api";
import PropTypes from "prop-types";
import UserContext from "../contexts/UserContext";

const Actions = ({ mangaId }) => {
  const { userId } = useContext(UserContext); // Pega o userId do contexto
  const [favorite, setFavorite] = useState(false);

  // Verifica se o mangá está nos favoritos
  const checkIfFavorite = useCallback(async () => {
    if (!userId) {
      console.warn("Usuário não autenticado.");
      return;
    }

    try {
      const user = await fetchAccountById(userId);
      if (user && Array.isArray(user.favorites)) {
        setFavorite(user.favorites.includes(mangaId));
      } else {
        console.error("Estrutura de favoritos inválida para o usuário.");
      }
    } catch (err) {
      console.error("Erro ao verificar favoritos:", err);
    }
  }, [userId, mangaId]);

  // Atualiza os favoritos com base no estado inicial
  useEffect(() => {
    checkIfFavorite();
  }, [checkIfFavorite]);

  // Adiciona o mangá aos favoritos
  const handleAddToFavorites = async () => {
    if (!userId) {
      console.warn("Usuário não autenticado.");
      return;
    }

    try {
      const user = await fetchAccountById(userId);
      if (!user || !Array.isArray(user.favorites)) {
        throw new Error("Estrutura de favoritos inválida.");
      }

      const updatedFavorites = [...new Set([...user.favorites, mangaId])]; // Garante que não haja duplicatas
      await updateAccount(userId, { ...user, favorites: updatedFavorites });
      setFavorite(true);
    } catch (err) {
      console.error("Erro ao adicionar aos favoritos:", err);
    }
  };

  // Remove o mangá dos favoritos
  const handleRemoveFromFavorites = async () => {
    if (!userId) {
      console.warn("Usuário não autenticado.");
      return;
    }

    try {
      const user = await fetchAccountById(userId);
      if (!user || !Array.isArray(user.favorites)) {
        throw new Error("Estrutura de favoritos inválida.");
      }

      const updatedFavorites = user.favorites.filter((id) => id !== mangaId);
      await updateAccount(userId, { ...user, favorites: updatedFavorites });
      setFavorite(false);
    } catch (err) {
      console.error("Erro ao remover dos favoritos:", err);
    }
  };

  // Compartilhar usando Web Share API (opcional)
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Confira este mangá!",
          text: `Dê uma olhada no mangá que encontrei: ${mangaId}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Erro ao compartilhar:", err));
    } else {
      alert("Compartilhamento não suportado neste navegador.");
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
      <button className={styles.actionButton} onClick={handleShare}>
        <IosShareIcon className={styles.actionIcon} />
      </button>
    </Box>
  );
};

Actions.propTypes = {
  mangaId: PropTypes.string.isRequired,
};

export default Actions;