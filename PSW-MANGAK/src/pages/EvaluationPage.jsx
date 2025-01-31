import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Container,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEvaluationsThunk,
  createEvaluationThunk,
  updateEvaluationThunk,
  deleteEvaluationThunk,
} from "../redux/evaluationSlice";
import * as api from "../../services/api";

const EvaluationPage = () => {
  const navigate = useNavigate();
  const { mangaId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { evaluations } = useSelector((state) => state.evaluations);
  const [authorName, setAuthorName] = useState("Carregando autor...");
  const [rating, setRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [manga, setManga] = useState(null);
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    const fetchMangaData = async () => {
      try {
        const data = await api.fetchMangaById(mangaId);
        setManga(data);
      } catch (error) {
        console.error("Erro ao buscar o manga:", error);
      }
    };

    fetchMangaData();
  }, [mangaId]);

  useEffect(() => {
    dispatch(fetchEvaluationsThunk(mangaId));
  }, [dispatch, mangaId]);

  useEffect(() => {
    if (evaluations.length > 0) {
      const avg =
        evaluations.reduce((acc, cur) => acc + cur.rating, 0) /
        evaluations.length;
      setAverageRating(Number(avg.toFixed(1)));
    } else {
      setAverageRating(0);
    }
  }, [evaluations]);

  // Função para buscar o nome do autor
  useEffect(() => {
    if (!manga?.authorId) {
      setAuthorName("Autor desconhecido");
      return;
    }
    api
      .fetchAuthorById(manga.authorId._id)
      .then((author) => {
        console.log(author);

        setAuthorName(author?.name || "Autor desconhecido");
      })
      .catch((error) => {
        console.error("Erro ao buscar autor:", error);
        setAuthorName("Erro ao carregar autor");
      });
  }, [manga?.authorId, manga]);

  useEffect(() => {
    const fetchUsernames = async () => {
      const fetchedUsernames = { ...usernames }; // Evita sobrescrever nomes já carregados
      const uniqueUserIds = [...new Set(evaluations.map((ev) => ev.userId))]; // Garante IDs únicos
  
      const userPromises = uniqueUserIds.map(async (userId) => {
        if (!fetchedUsernames[userId]) {
          try {
            const user = await api.fetchAccountById(userId);
            fetchedUsernames[userId] = user?.username || "Nome desconhecido";
          } catch (error) {
            console.error(`Erro ao buscar usuário ${userId}:`, error);
            fetchedUsernames[userId] = "Erro ao carregar";
          }
        }
      });
  
      await Promise.all(userPromises);
      setUsernames(fetchedUsernames);
    };
  
    if (evaluations.length > 0) {
      fetchUsernames();
    }
  }, [evaluations, usernames]);  

  useEffect(() => {
    dispatch(fetchEvaluationsThunk(mangaId));
  }, [evaluations, dispatch, mangaId]);  

  const handleAuthorClick = () => {
    if (manga?.authorId?._id) {
      navigate(`/authors/${manga.authorId._id}`);
    }
  };

  const handleSubmit = async () => {
    if (!user || !user.id) {
      console.error("Usuário não autenticado.");
      return;
    }
  
    try {
      const evaluationData = {
        rating,
        comment: newComment,
        userId: user._id,
      };
  
      if (editingId) {
        await dispatch(
          updateEvaluationThunk({
            evaluationId: editingId,
            userId: user._id,
            evaluationData,
            mangaId,
          })
        );
      } else {
        await dispatch(
          createEvaluationThunk({
            mangaId,
            evaluationData,
            userId: user._id,
          })
        );
      }
  
      setEditingId(null);
      setNewComment("");
      setRating(0);
  
      // A linha abaixo atualiza as avaliações depois de salvar a edição ou criação
      await dispatch(fetchEvaluationsThunk(mangaId));
    } catch (err) {
      console.error("Erro ao salvar avaliação.", err);
    }
  };
  

  const handleDelete = async (evaluationId) => {
    try {
      await dispatch(deleteEvaluationThunk({ evaluationId }));
      dispatch(fetchEvaluationsThunk(mangaId));
    } catch (err) {
      console.error("Erro ao excluir avaliação.", err);
    }
  };

  const handleEdit = (comment) => {
    setEditingId(comment._id);
    setNewComment(comment.comment);
    setRating(comment.rating);
  };

  return (
    <Box sx={{ backgroundColor: "black" }}>
      <Navbar />
      <Container>
        <Typography variant="h2" color="white" sx={{ marginBottom: 2 }}>
          {manga?.title || "Carregando título..."}
        </Typography>
        <Typography
          variant="h4"
          color="red"
          onClick={handleAuthorClick}
          sx={{
            width: "400px",
            cursor: "pointer",
            color: "white",
            ":hover": {
              color: "red",
            },
          }}
        >
          {authorName}
        </Typography>

        <Typography variant="h6" color="white">
          Média de Avaliações: {averageRating} ⭐
        </Typography>
        {evaluations.map((comment) => (
          <Box
            key={comment._id}
            sx={{
              margin: 2,
              padding: 2,
              border: "1px solid #ccc",
              borderRadius: 2,
              backgroundColor: "gray",
            }}
          >
            <Typography variant="h6" color="white">
              {comment._id || "Nome de usuário desconhecido"}
            </Typography>
            <Rating
              value={comment.rating}
              readOnly
              sx={{
                color: "yellow",
                "& .MuiRating-iconFilled": { color: "yellow" },
                "& .MuiRating-iconEmpty": { color: "yellow" },
                "& .MuiRating-icon:hover": { borderColor: "yellow" },
              }}
            />
            <Typography color="white">{comment.comment}</Typography>
            {comment.userId === user?._id && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  color="error"
                  variant="contained"
                  onClick={() => handleEdit(comment)}
                  sx={{ marginTop: 2 }}
                >
                  Editar
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  onClick={() => handleDelete(comment._id)}
                  sx={{ marginTop: 2 }}
                >
                  Excluir
                </Button>
              </Box>
            )}
          </Box>
        ))}

        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5" color="white">
            Adicionar Avaliação
          </Typography>
          <Rating
            sx={{
              marginY: 1,
              color: "yellow",
              "& .MuiRating-iconFilled": { color: "yellow" },
              "& .MuiRating-iconEmpty": { color: "yellow" },
              "& .MuiRating-icon:hover": { borderColor: "yellow" },
            }}
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
          />
          <TextField
            fullWidth
            multiline
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escreva sua avaliação..."
            sx={{ marginTop: 1, border: "1px solid #fff" }}
            InputProps={{ style: { color: "white", fontSize: "18px" } }}
            InputLabelProps={{ style: { color: "white", fontSize: "18px" } }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ marginTop: 3, backgroundColor: "red" }}
            disabled={!rating || !newComment || !user}
          >
            ENVIAR
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default EvaluationPage;