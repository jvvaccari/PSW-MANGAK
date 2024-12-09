import { useState, useEffect, useCallback } from "react";
import { fetchAccountById, updateAccount } from "../../services/api";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import IosShareIcon from "@mui/icons-material/IosShare";
import { Button, Box } from "@mui/material";
import PropTypes from "prop-types";
import useAuth from "../contexts/useAuth";

const Actions = ({ mangaId }) => {
  const { user } = useAuth(); // Obtém o usuário autenticado
  const [favorite, setFavorite] = useState(false);

  // Verifica se o mangá está nos favoritos
  const checkIfFavorite = useCallback(async () => {
    if (!user?.id) {
      console.warn("Usuário não autenticado.");
      return;
    }

    try {
      const fetchedUser = await fetchAccountById(user.id);
      if (fetchedUser && Array.isArray(fetchedUser.favorites)) {
        setFavorite(fetchedUser.favorites.includes(mangaId));
      } else {
        console.error("Estrutura de favoritos inválida para o usuário.");
      }
    } catch (err) {
      console.error("Erro ao verificar favoritos:", err);
    }
  }, [user?.id, mangaId]);

  useEffect(() => {
    checkIfFavorite();
  }, [checkIfFavorite]);

  const handleAddToFavorites = async () => {
    if (!user?.id) {
      console.warn("Usuário não autenticado.");
      return;
    }

    try {
      const fetchedUser = await fetchAccountById(user.id);
      if (!fetchedUser || !Array.isArray(fetchedUser.favorites)) {
        throw new Error("Estrutura de favoritos inválida.");
      }

      const updatedFavorites = [...new Set([...fetchedUser.favorites, mangaId])];
      await updateAccount(user.id, { ...fetchedUser, favorites: updatedFavorites });
      setFavorite(true);
    } catch (err) {
      console.error("Erro ao adicionar aos favoritos:", err);
    }
  };

  const handleRemoveFromFavorites = async () => {
    if (!user?.id) {
      console.warn("Usuário não autenticado.");
      return;
    }

    try {
      const fetchedUser = await fetchAccountById(user.id);
      if (!fetchedUser || !Array.isArray(fetchedUser.favorites)) {
        throw new Error("Estrutura de favoritos inválida.");
      }

      const updatedFavorites = fetchedUser.favorites.filter((id) => id !== mangaId);
      await updateAccount(user.id, { ...fetchedUser, favorites: updatedFavorites });
      setFavorite(false);
    } catch (err) {
      console.error("Erro ao remover dos favoritos:", err);
    }
  };

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
    <Box sx={{ display: "flex", gap: "12px", marginTop: "16px" }}>
      {!favorite ? (
        <Button
          variant="outlined"
          onClick={handleAddToFavorites}
          sx={{
            borderColor: "var(--btn-mangak-color)",
            color: "var(--btn-mangak-color)",
            "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.1)" },
          }}
        >
          <BookmarkAddIcon sx={{ marginRight: "8px" }} />
          Adicionar aos Favoritos
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={handleRemoveFromFavorites}
          sx={{
            backgroundColor: "var(--btn-mangak-color)",
            color: "#fff",
            "&:hover": { backgroundColor: "rgba(200, 0, 0, 0.8)" },
          }}
        >
          <BookmarkAddedIcon sx={{ marginRight: "8px" }} />
          Remover dos Favoritos
        </Button>
      )}

      <Button
        variant="contained"
        onClick={handleShare}
        sx={{
          backgroundColor: "var(--btn-mangak-color)",
          color: "#fff",
          "&:hover": { backgroundColor: "rgba(200, 0, 0, 0.8)" },
        }}
      >
        <IosShareIcon sx={{ marginRight: "8px" }} />
        Compartilhar
      </Button>
    </Box>
  );
};

Actions.propTypes = {
  mangaId: PropTypes.string.isRequired,
};

export default Actions;