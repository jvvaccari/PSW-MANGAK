import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Alert,
  CircularProgress,
  Container,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { MangaAPI, EvaluationAPI } from "../../services/api";

const EvaluationPage = () => {
  const { mangaId, userId } = useParams();
  const [manga, setManga] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const mangaData = await MangaAPI.fetchById(mangaId);
        const evaluations =
          await EvaluationAPI.fetchMangaAndEvaluations(mangaId);
        setManga(mangaData);
        setComments(evaluations);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar dados. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mangaId]);

  useEffect(() => {
    if (comments.length > 0) {
      const avg =
        comments.reduce((acc, cur) => acc + cur.rating, 0) / comments.length;
      setAverageRating(Number(avg.toFixed(1)));
    } else {
      setAverageRating(0);
    }
  }, [comments]);

  const handleSubmit = async () => {
    if (!userId) {
      setError("Você precisa estar logado para avaliar um mangá.");
      return;
    }

    try {
      if (editingId) {
        await EvaluationAPI.update(editingId, { rating, comment: newComment });
      } else {
        await EvaluationAPI.createEvaluation(
          mangaId,
          { rating, comment: newComment },
          userId
        );
      }
      setEditingId(null);
      setNewComment("");
      setRating(0);
      setError(null);

      const evaluations = await EvaluationAPI.fetchMangaAndEvaluations(mangaId);
      setComments(evaluations);
    } catch (err) {
      setError("Erro ao salvar avaliação. Tente novamente.", err);
    }
  };

  const handleDelete = async (evaluationId) => {
    try {
      console.log(evaluationId);
      const evaluation = comments.find((c) => c.id === evaluationId);
      if (!evaluation || evaluation.userId !== userId) {
        setError("Você não pode excluir avaliações de outros usuários.");
        return;
      }
      
      await EvaluationAPI.delete(evaluationId);
      
      setComments((prev) => prev.filter((c) => c.id !== evaluationId));
      
    } catch (err) {
      console.error('Erro ao excluir:', err); 
      setError("Erro ao excluir avaliação. Tente novamente.");
    }
  };  

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!manga) return <Alert severity="warning">Mangá não encontrado.</Alert>;

  return (
    <Box sx={{ backgroundColor: "black" }}>
      <Navbar />
      <Container>
        <Typography variant="h2" color="white" sx={{ marginBottom: 2 }}>
          {manga.title}
        </Typography>
        <Typography variant="h4" color="red" sx={{ marginBottom: 4 }}>
          {manga.authorId.name}
        </Typography>
        <Typography variant="h6" color="white">
          Média de Avaliações: {averageRating} ⭐
        </Typography>
        {comments.map((comment) => (
          <Box
            key={comment.id}
            sx={{
              margin: 2,
              padding: 2,
              border: "1px solid #ccc",
              borderRadius: 2,
              backgroundColor: "gray",
            }}
          >
            <Typography variant="h6" color="white">
              {comment.username}
            </Typography>
            <Rating
              value={comment.rating}
              readOnly
              sx={{
                color: "yellow",
                "& .MuiRating-iconFilled": {
                  color: "yellow",
                },
                "& .MuiRating-iconEmpty": {
                  color: "yellow",
                  borderColor: "yellow",
                },
              }}
            />
            <Typography color="white">{comment.comment}</Typography>
            {comment.userId === userId && (
              <Button
                color="error"
                variant="outlined"
                onClick={() => handleDelete(comment.id)}
                sx={{ marginTop: 2 }}
              >
                Excluir
              </Button>
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
              "& .MuiRating-iconFilled": {
                color: "yellow",
              },
              "& .MuiRating-iconEmpty": {
                color: "yellow",
                borderColor: "yellow",
              },
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
          >
            ENVIAR
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default EvaluationPage;
