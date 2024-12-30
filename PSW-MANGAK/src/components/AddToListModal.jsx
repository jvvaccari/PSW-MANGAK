import { useState, useEffect } from "react";
import { Button, Modal, Box, Typography, FormControl, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import { fetchFavoriteLists, addMangaToList, removeMangaFromList, createFavoriteList } from "../../services/api";
import { Warning } from "@mui/icons-material"; // Adicionando ícone de alerta para feedback visual

const AddToListModal = ({ open, onClose, mangaId, userId, action }) => {
  const [favoriteLists, setFavoriteLists] = useState([]);
  const [selectedList, setSelectedList] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Para mostrar erros ao usuário

  useEffect(() => {
    if (open && userId) {
      setLoading(true);
      fetchFavoriteLists(userId)
        .then((lists) => {
          setFavoriteLists(lists || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao carregar listas de favoritos:", error);
          setError("Erro ao carregar as listas. Tente novamente.");
          setLoading(false);
        });
    }
  }, [open, userId]);

  const handleAddToList = () => {
    if (!selectedList) {
      setError("Por favor, selecione uma lista.");
      return;
    }
  
    setError(null); // Limpa o erro
  
    if (action === "add") {
      console.log("Adicionando mangaId:", mangaId, "na lista:", selectedList);
  
      // Verifique se a lista existe, caso contrário, crie uma nova
      if (selectedList === "nova") {
        const newListData = {
          name: "Nova Lista",  // Ou use um nome dinâmico se necessário
          userId: userId,
          mangas: [mangaId], // Inclua o manga diretamente
        };
  
        createFavoriteList(newListData)  // Função de criação de lista
          .then((newList) => {
            console.log("Nova lista criada:", newList);
            onClose(); // Feche o modal
          })
          .catch((error) => {
            console.error("Erro ao criar a nova lista:", error);
            setError("Erro ao criar a nova lista. Tente novamente.");
          });
      } else {
        // Caso a lista já exista, adicione o manga a ela
        addMangaToList(selectedList, mangaId)  // Função para adicionar manga à lista existente
          .then(() => {
            onClose();  // Feche o modal
          })
          .catch((error) => {
            console.error("Erro ao adicionar mangá à lista:", error);
            setError("Erro ao adicionar o mangá à lista. Tente novamente.");
          });
      }
    } else if (action === "remove") {
      // Remover manga
      removeMangaFromList(selectedList, mangaId)
        .then(() => {
          onClose();
        })
        .catch((error) => {
          console.error("Erro ao remover mangá da lista:", error);
          setError("Erro ao remover o mangá da lista. Tente novamente.");
        });
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
        }}
      >
        <Typography variant="h6" component="h2" sx={{ marginBottom: "16px" }}>
          {action === "add" ? "Selecionar Lista para Adicionar" : "Selecionar Lista para Remover"}
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
              {/* Adicionando uma opção para nova lista */}
              <MenuItem value="nova">Nova Lista</MenuItem>
            </Select>
          </FormControl>
        )}

        <Button
          variant="contained"
          sx={{ marginTop: "16px" }}
          onClick={handleAddToList}
          disabled={loading || !selectedList}
        >
          {action === "add" ? "Adicionar à Lista" : "Remover da Lista"}
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
  action: PropTypes.oneOf(["add", "remove"]).isRequired,
};

export default AddToListModal;
