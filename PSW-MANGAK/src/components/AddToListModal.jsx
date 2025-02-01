import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
} from "@mui/material";
import PropTypes from "prop-types";
import * as api from "../../services/api";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AddToListModal = ({ open, onClose, userId, onSelect }) => {
  const [favoriteLists, setFavoriteLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
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
      .catch(() => {
        setError("Erro ao carregar as listas. Tente novamente.");
      })
      .finally(() => setLoading(false));
  }, [open, userId]);

  const handleSelectList = () => {
    if (selectedList) {
      onSelect([selectedList]);
      onClose();
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
            <InputLabel id="single-select-label">Lista</InputLabel>
            <Select
              labelId="single-select-label"
              value={selectedList || ""}
              onChange={(e) => setSelectedList(e.target.value)}
              input={<OutlinedInput label="Lista" />}
              MenuProps={MenuProps}
            >
              {favoriteLists.map((list, index) => (
                <MenuItem key={list._id || `list-${index}`} value={list._id}>
                  {list.name || "Sem nome"}
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

AddToListModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default AddToListModal;
