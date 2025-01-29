import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  Modal,
  TextField,
  CircularProgress,
  AppBar,
  Toolbar,
} from "@mui/material";
import { FavoriteListAPI } from "../../services/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";

const FavoritesPage = () => {
  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [listName, setListName] = useState("");

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const loadLists = async () => {
      try {
        const data = await FavoriteListAPI.fetchById(user.id);
        setLists(data || []);
      } catch {
        setError("Erro ao carregar listas.");
      } finally {
        setLoading(false);
      }
    };

    loadLists();
  }, [user]);

  const handleCreateList = async () => {
    if (!listName.trim()) {
      setError("O nome da lista é obrigatório.");
      return;
    }
    try {
      const newList = await FavoriteListAPI.create({ name: listName, userId: user.id, mangas: [] });
      setLists([...lists, newList]);
      setListName("");
      setOpenModal(false);
    } catch {
      setError("Erro ao criar lista.");
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setListName("");
    setError(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#121212" }}>
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#121212", minHeight: "100vh" }}>
      <AppBar position="static" sx={{ backgroundColor: "#121212" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold" }}>
            Suas Listas de Favoritos
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: "16px", backgroundColor: "#121212", minHeight: "calc(100vh - 64px)" }}>
        <Box sx={{ textAlign: "center", marginBottom: "16px" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
            sx={{
              backgroundColor: "#FF0037",
              color: "#fff",
              "&:hover": { backgroundColor: "#cc0030" },
            }}
          >
            Criar Nova Lista
          </Button>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {lists.map((list) => (
            <Grid item xs={12} sm={6} md={4} key={list.id}>
              <Box
                sx={{
                  backgroundColor: "#1c1c1c",
                  color: "#fff",
                  padding: "16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  textAlign: "center",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": { backgroundColor: "#333", transform: "scale(1.05)" },
                }}
                onClick={() => navigate(`/favorites/lists/${list.id}`)}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "8px" }}>
                  {list.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
                  {list.mangas?.length ? `${list.mangas.length} Mangás` : "Sem Mangás"}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Modal open={openModal} onClose={handleModalClose}>
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
          <Typography variant="h6" sx={{ marginBottom: "16px" }}>
            Criar Nova Lista de Favoritos
          </Typography>
          <TextField
            label="Nome da Lista"
            variant="outlined"
            fullWidth
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            sx={{ marginBottom: "16px" }}
          />
          {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FF0037",
              color: "#fff",
              "&:hover": { backgroundColor: "#cc0030" },
            }}
            onClick={handleCreateList}
            fullWidth
          >
            Criar Lista
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default FavoritesPage;
