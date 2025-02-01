import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";
import * as api from "../../services/api";

const ListSelectorModal = ({ open, onClose, userId, onSelect }) => {
  const [favoriteLists, setFavoriteLists] = useState([]);
  const [selectedList, setSelectedList] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !userId) return;

    setLoading(true);
    setError("");

    api
      .fetchFavoriteLists(userId)
      .then((lists) => {
        setFavoriteLists(lists || []);
      })
      .catch((err) => {
        setError("Erro ao carregar as listas. Tente novamente.",err);
      })
      .finally(() => setLoading(false));
  }, [open, userId]);

  const handleSelectList = () => {
    if (selectedList) {
      onSelect(selectedList);
      onClose(); // Fecha o modal após a seleção
    } else {
      setError("Por favor, selecione uma lista.");
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
          Selecione uma Lista
        </Typography>

        {error && (
          <Typography color="error" sx={{ marginBottom: "16px" }}>
            {error}
          </Typography>
        )}

        {loading ? (
          <Typography>Carregando...</Typography>
        ) : (
          <FormControl fullWidth>
            <Select
              value={selectedList}
              displayEmpty
              inputProps={{ "aria-label": "Selecione uma lista" }}
              onChange={(e) => setSelectedList(e.target.value)}
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
          sx={{ marginTop: "16px" }}
          onClick={handleSelectList}
          disabled={loading || !selectedList}
        >
          Selecionar
        </Button>
      </Box>
    </Modal>
  );
};

ListSelectorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired, // Função que irá receber a lista selecionada
};

export default ListSelectorModal;
