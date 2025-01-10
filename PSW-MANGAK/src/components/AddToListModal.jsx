import { useState, useEffect } from "react";
import { Button, Modal, Box, Typography, FormControl, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import { fetchFavoriteLists, addMangaToList, createFavoriteList } from "../../services/api";
import { Warning } from "@mui/icons-material"; 

const AddToListModal = ({ open, onClose, mangaId, userId }) => { 
  const [favoriteLists, setFavoriteLists] = useState([]);
  const [selectedList, setSelectedList] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && userId) {
      setLoading(true);
      fetchFavoriteLists(userId)
        .then((lists) => {
          setFavoriteLists(lists || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erro ao carregar listas de favoritos:", err);
          setError("Erro ao carregar as listas. Tente novamente.");
          setLoading(false);
        });
    }
  }, [open, userId]);

  const handleAddToList = async () => {
    if (!selectedList) {
      setError("Por favor, selecione uma lista.");
      return;
    }

    setError(null);

    try {
      if (selectedList === "nova") {

        const newListData = {
          name: `Nova Lista - ${new Date().toLocaleDateString()}`,
          userId,
          mangas: [mangaId],
        };

        await createFavoriteList(newListData);
        console.log("Nova lista criada com sucesso.");
      } else {

        await addMangaToList(selectedList, mangaId);
        console.log("Mangá adicionado à lista com sucesso.");
      }

      onClose();
    } catch (err) {
      console.error("Erro ao adicionar o mangá à lista:", err);
      setError("Erro ao adicionar o mangá à lista. Tente novamente.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          width: "300px",
          textAlign: "center",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h6" component="h2" sx={{ marginBottom: "16px" }}>
          Adicionar
        </Typography>

        {error && (
          <Box sx={{ color: "red", display: "flex", alignItems: "center", marginBottom: "16px" }}>
            <Warning sx={{ marginRight: "8px" }} />
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}

        {loading ? (
          <Typography>Carregando...</Typography>
        ) : (
          <FormControl fullWidth>
            <Select
              value={selectedList}
              onChange={(e) => setSelectedList(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Selecione uma lista" }}
            >
              <MenuItem value="" disabled>
                Selecione uma lista
              </MenuItem>
              {favoriteLists.map((list) => (
                <MenuItem key={list.id} value={list.id}>
                  {list.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Button
          variant="contained"
          sx={{
            marginTop: "16px",
            backgroundColor: "var(--btn-mangak-color)",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#404040",
            },
          }}
          onClick={handleAddToList}
          disabled={loading || !selectedList}
        >
          Adicionar
        </Button>
      </Box>
    </Modal>
  );
};

AddToListModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  mangaId: PropTypes.string.isRequired,
  userId: PropTypes.string,
};

export default AddToListModal;
