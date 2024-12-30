import { useEffect, useState } from "react";
import {
  BookmarkAdd as AddIcon,
  BookmarkAdded as AddedIcon,
  IosShare as ShareIcon,
} from "@mui/icons-material";
import { Button, Box } from "@mui/material";
import PropTypes from "prop-types";
import useAuth from "../contexts/useAuth";
import AddToListModal from "./AddToListModal";
import { fetchAccountById, updateAccount } from "../../services/api";

const Actions = ({ mangaId }) => {
  const { user } = useAuth();
  const [favorite, setFavorite] = useState(false); // Controle do estado de favorito
  const [openModal, setOpenModal] = useState(false);
  const [initialFavoriteState, setInitialFavoriteState] = useState(false); // Para restaurar o estado inicial
  const [buttonText, setButtonText] = useState("Adicionar"); // Texto do botão para Adicionar
  const [buttonDisabled, setButtonDisabled] = useState(false); // Desabilitar o botão temporariamente

  // Verifica o status inicial do favorito quando o componente carrega
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user?.id) {
        try {
          const account = await fetchAccountById(user.id);
          if (account && account.favorites?.includes(mangaId)) {
            setFavorite(true); // Marca como favorito se já estiver na lista
            setInitialFavoriteState(true); // Guarda o estado inicial como "favorito"
          } else {
            setFavorite(false); // Caso contrário, está como "não favorito"
            setInitialFavoriteState(false); // Guarda o estado inicial como "não favorito"
          }
        } catch (err) {
          console.error("Erro ao verificar status de favorito:", err);
        }
      }
    };

    checkFavoriteStatus();
  }, [user, mangaId]);

  const handleFavorite = async () => {
    if (!user?.id) return console.warn("Usuário não autenticado.");

    try {
      const account = await fetchAccountById(user.id);
      if (!account) throw new Error("Usuário não encontrado");

      let updatedFavorites;
      if (favorite) {
        // Remover manga diretamente sem abrir o modal
        updatedFavorites = account.favorites.filter((id) => id !== mangaId);
        setFavorite(false); // Atualiza o estado para não favorito
      } else {
        // Adicionar manga e abrir o modal
        updatedFavorites = [...new Set([...account.favorites, mangaId])];
        setFavorite(true); // Marca como favorito
        setOpenModal(true); // Abre o modal para adicionar à lista

        // Mudando o botão para "Adicionado" e desabilitando temporariamente
        setButtonText("Adicionado");
        setButtonDisabled(true);

        // Restaura o estado do botão após 3 segundos
        setTimeout(() => {
          setButtonText("Adicionar");
          setButtonDisabled(false); // Habilita o botão novamente
          setFavorite(false); // Volta para o estado "Adicionar"
        }, 3000);
      }

      const updatedAccount = {
        ...account,
        favorites: updatedFavorites,
      };

      await updateAccount(user.id, updatedAccount);
    } catch (err) {
      console.error("Erro ao atualizar favoritos:", err);
    }
  };

  const handleShare = () => {
    navigator.share
      ? navigator.share({
          title: "Confira este mangá!",
          text: `Dê uma olhada no mangá que encontrei: ${mangaId}`,
          url: window.location.href,
        }).catch(console.error)
      : alert("Compartilhamento não suportado neste navegador.");
  };

  const handleModalClose = () => {
    // Quando o modal for fechado sem ação, restaura o estado de favorito
    setFavorite(initialFavoriteState); // Restaura o estado de favorito
    setOpenModal(false); // Fecha o modal
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
        onClick={handleFavorite}
        sx={{
          ...buttonStyles,
          borderColor: "var(--btn-mangak-color)",
          color: favorite ? "#fff" : "var(--btn-mangak-color)",
          backgroundColor: favorite ? "var(--btn-mangak-color)" : "transparent",
          "&:hover": favorite
            ? { backgroundColor: "rgba(200, 0, 0, 0.8)" }
            : { backgroundColor: "rgba(255, 0, 0, 0.1)" },
        }}
        disabled={buttonDisabled}
      >
        {favorite ? <AddedIcon sx={{ fontSize: "1rem", marginRight: "6px" }} /> : <AddIcon sx={{ fontSize: "1rem", marginRight: "6px" }} />}
        {buttonText}
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

      <AddToListModal
        open={openModal}
        onClose={handleModalClose} // Chama a função que restaura o estado ao fechar
        mangaId={mangaId}
        userId={user?.id} // Passa o userId para o modal
        action="add" // Determina que o modal é para adicionar
      />
    </Box>
  );
};

Actions.propTypes = {
  mangaId: PropTypes.string.isRequired,
};

export default Actions;
