import { useState, useEffect, useCallback } from "react";
import { fetchAccountById, updateAccount } from "../../services/api";
import { BookmarkAdd as AddIcon, BookmarkAdded as AddedIcon, IosShare as ShareIcon } from "@mui/icons-material";
import { Button, Box } from "@mui/material";
import PropTypes from "prop-types";
import useAuth from "../contexts/useAuth";

const Actions = ({ mangaId }) => {
  const { user } = useAuth();
  const [favorite, setFavorite] = useState(false);

  const fetchAndUpdateFavorite = useCallback(async (add) => {
    if (!user?.id) return console.warn("Usuário não autenticado.");
  
    try {
      const account = await fetchAccountById(user.id);
  
      if (!account) throw new Error("Usuário não encontrado");
  
      const updatedFavorites = add
        ? Array.from(new Set([...account.favorites, mangaId]))
        : account.favorites.filter((id) => id !== mangaId);
  
      const updatedAccount = {
        ...account, // Inclui todas as propriedades existentes
        favorites: updatedFavorites, // Atualiza apenas os favoritos
      };
  
      await updateAccount(user.id, updatedAccount);
      setFavorite(add);
    } catch (err) {
      console.error("Erro ao atualizar favoritos:", err);
    }
  }, [user?.id, mangaId]);
  

  useEffect(() => {
    if (user?.id) {
      fetchAccountById(user.id)
        .then(({ favorites = [] }) => setFavorite(favorites.includes(mangaId)))
        .catch((err) => console.error("Erro ao verificar favoritos:", err));
    }
  }, [user?.id, mangaId]);

  const handleShare = () => {
    navigator.share
      ? navigator.share({
          title: "Confira este mangá!",
          text: `Dê uma olhada no mangá que encontrei: ${mangaId}`,
          url: window.location.href,
        }).catch(console.error)
      : alert("Compartilhamento não suportado neste navegador.");
  };

  const buttonStyles = {
    fontSize: "0.8rem",
    padding: "6px 10px",
    maxWidth: "250px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px" }}>
      <Button
        variant={favorite ? "contained" : "outlined"}
        onClick={() => fetchAndUpdateFavorite(!favorite)}
        sx={{
          ...buttonStyles,
          borderColor: "var(--btn-mangak-color)",
          color: favorite ? "#fff" : "var(--btn-mangak-color)",
          backgroundColor: favorite ? "var(--btn-mangak-color)" : "transparent",
          "&:hover": favorite
            ? { backgroundColor: "rgba(200, 0, 0, 0.8)" }
            : { backgroundColor: "rgba(255, 0, 0, 0.1)" },
        }}
      >
        {favorite ? <AddedIcon sx={{ fontSize: "1rem", marginRight: "6px" }} /> : <AddIcon sx={{ fontSize: "1rem", marginRight: "6px" }} />}
        {favorite ? "Remover" : "Adicionar"}
      </Button>

      <Button
        variant="contained"
        onClick={handleShare}
        sx={{
          ...buttonStyles,
          backgroundColor: "var(--btn-mangak-color)",
          color: "#fff",
        }}
      >
        <ShareIcon sx={{ fontSize: "1rem", marginRight: "6px" }} />
        Compartilhar
      </Button>

      <Box sx={{ height: "12px" }} />
    </Box>
  );
};

Actions.propTypes = {
  mangaId: PropTypes.string.isRequired,
};

export default Actions;
