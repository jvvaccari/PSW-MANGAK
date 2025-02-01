import { useState } from "react";
import { useSelector } from "react-redux";
import {
  BookmarkAdd as AddIcon,
  IosShare as ShareIcon,
} from "@mui/icons-material";
import { Button, Box } from "@mui/material";
import PropTypes from "prop-types";
import * as api from "../../services/api";

import AddToListModal from "./AddToListModal";

const Actions = ({ mangaId }) => {
  const { user } = useSelector((state) => state.auth);
  const [openModal, setOpenModal] = useState(false);

  const handleAddToList = () => setOpenModal(true);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Confira este mangá!",
          text: `Dê uma olhada no mangá que encontrei: ${mangaId}`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      alert("Compartilhamento não suportado neste navegador.");
    }
  };

  const commonButtonStyles = {
    fontSize: "0.8rem",
    padding: "6px 10px",
    width: "150px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--btn-mangak-color)",
    color: "#fff",
    ":hover": {
      backgroundColor: "#CC002A",
      transform: "scale(1.1)",
    },
  };

  // Actions.jsx
  const handleSelectList = (listId) => {
    console.log("ListID:", listId); // Verifique o valor de listId
    console.log("MangaId:", mangaId); // Verifique o valor de mangaId

    if (mangaId) {
      api.addMangaToList(listId, mangaId); // Função que realiza a requisição
    } else {
      console.error("mangaId está undefined");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "1em",
        marginTop: "16px",
      }}
    >
      <Button
        variant="contained"
        onClick={handleAddToList}
        sx={commonButtonStyles}
      >
        <AddIcon sx={{ fontSize: "1rem", marginRight: "6px" }} />
        Adicionar
      </Button>

      <Button variant="contained" onClick={handleShare} sx={commonButtonStyles}>
        <ShareIcon sx={{ fontSize: "1rem", marginRight: "6px" }} />
        Compartilhar
      </Button>

      <AddToListModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        mangaId={mangaId}
        userId={user?.id}
        onSelect={handleSelectList} // Passando a função onSelect
      />
    </Box>
  );
};

Actions.propTypes = {
  mangaId: PropTypes.string.isRequired,
};

export default Actions;
