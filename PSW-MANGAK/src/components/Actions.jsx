import { useState } from "react";
import { BookmarkAdd as AddIcon, IosShare as ShareIcon } from "@mui/icons-material";
import { Button, Box } from "@mui/material";
import PropTypes from "prop-types";
import useAuth from "../contexts/useAuth";
import AddToListModal from "./AddToListModal";

const Actions = ({ mangaId }) => {
  const { user } = useAuth();
  const [openModal, setOpenModal] = useState(false);

  const handleAddToList = () => {
    setOpenModal(true); 
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
    <Box sx={{ display: "flex", flexDirection: "row", gap: "8px", marginTop: "16px" }}>

      <Button
        variant="contained"
        onClick={handleAddToList}
        sx={{
          ...buttonStyles,
          backgroundColor: "var(--btn-mangak-color)",
          color: "#fff",
        }}
      >
        <AddIcon sx={{ fontSize: "1rem", marginRight: "6px" }} />
        Adicionar
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
        onClose={() => setOpenModal(false)}
        mangaId={mangaId}
        userId={user?.id}
      />
    </Box>
  );
};

Actions.propTypes = {
  mangaId: PropTypes.string.isRequired,
};

export default Actions;
