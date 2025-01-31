import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, TextField, Button, Rating, Alert, CircularProgress, Container } from "@mui/material";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvaluationsThunk, createEvaluationThunk, updateEvaluationThunk, deleteEvaluationThunk } from "../redux/evaluationSlice";

const EvaluationPage = () => {
  const { mangaId, userId } = useParams();
  const dispatch = useDispatch();

  const { evaluations, loading, error } = useSelector((state) => state.evaluations);
  const [rating, setRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  // Carrega as avaliações ao montar o componente
  useEffect(() => {
    dispatch(fetchEvaluationsThunk(mangaId));
  }, [dispatch, mangaId]);

  // Atualiza a média das avaliações
  useEffect(() => {
    if (evaluations.length > 0) {
      const avg = evaluations.reduce((acc, cur) => acc + cur.rating, 0) / evaluations.length;
      setAverageRating(Number(avg.toFixed(1)));
    } else {
      setAverageRating(0);
    }
  }, [evaluations]);

  // Função para criar ou atualizar uma avaliação
  const handleSubmit = async () => {
    if (!userId || rating === 0 || newComment.trim() === "") {
      return;
    }

    try {
      if (editingId) {
        await dispatch(updateEvaluationThunk({ 
          evaluationId: editingId, 
          evaluationData: { rating, comment: newComment, userId, username: "Nome do Usuário" }, // Passa o nome do usuário
          mangaId 
        }));        
      } else {
        await dispatch(createEvaluationThunk({ 
          mangaId, 
          evaluationData: { rating, comment: newComment }, 
          userId 
        }));
      }

      // Limpar estado após criar ou atualizar
      setEditingId(null);
      setNewComment("");
      setRating(0);

      // Recarrega as avaliações após a operação
      dispatch(fetchEvaluationsThunk(mangaId));
    } catch (err) {
      console.error("Erro ao salvar avaliação.", err);
    }
  };

  // Função para excluir uma avaliação
  const handleDelete = async (evaluationId) => {
    const evaluation = evaluations.find((c) => c.id === evaluationId);
    if (!evaluation || evaluation.userId !== userId) {
      return;
    }

    try {
      await dispatch(deleteEvaluationThunk({ evaluationId, mangaId }));

      // Recarrega as avaliações após a exclusão
      dispatch(fetchEvaluationsThunk(mangaId));
    } catch (err) {
      console.error("Erro ao excluir avaliação.", err);
    }
  };

  // Função para editar uma avaliação
  const handleEdit = (comment) => {
    setEditingId(comment.id);
    setNewComment(comment.comment);
    setRating(comment.rating);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ backgroundColor: "black" }}>
      <Navbar />
      <Container>
        <Typography variant="h2" color="white" sx={{ marginBottom: 2 }}>
          {evaluations[0]?.mangaTitle}
        </Typography>
        <Typography variant="h4" color="red" sx={{ marginBottom: 4 }}>
          {evaluations[0]?.authorName}
        </Typography>
        <Typography variant="h6" color="white">
          Média de Avaliações: {averageRating} ⭐
        </Typography>
        {evaluations.map((comment) => (
          <Box key={comment.id} sx={{ margin: 2, padding: 2, border: "1px solid #ccc", borderRadius: 2, backgroundColor: "gray" }}>
            <Typography variant="h6" color="white">
              {comment.username}
            </Typography>
            <Rating
              value={comment.rating}
              readOnly
              sx={{
                color: "yellow",  // Cor das estrelas
                "& .MuiRating-iconFilled": {
                  color: "yellow", // Estrela preenchida em amarelo
                },
                "& .MuiRating-iconEmpty": {
                  color: "yellow", // Estrela vazia em amarelo
                },
                "& .MuiRating-icon:hover": {
                  borderColor: "yellow", // Borda amarela ao passar o mouse
                },
              }}
            />
            <Typography color="white">{comment.comment}</Typography>
            {comment.userId === userId && (
              <Box sx={{display: "flex",gap: 1}}>
                <Button color="error" variant="contained" onClick={() => handleEdit(comment)} sx={{ marginTop: 2 }}>
                  Editar
                </Button>
                <Button color="error" variant="contained" onClick={() => handleDelete(comment.id)} sx={{ marginTop: 2 }}>
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
              color: "yellow",  // Cor das estrelas
              "& .MuiRating-iconFilled": {
                color: "yellow", // Estrela preenchida em amarelo
              },
              "& .MuiRating-iconEmpty": {
                color: "yellow", // Estrela vazia em amarelo
              },
              "& .MuiRating-icon:hover": {
                borderColor: "yellow", // Borda amarela ao passar o mouse
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
            sx={{
              marginTop: 1,
              border: "1px solid #fff",
            }}
            InputProps={{ style: { color: "white", fontSize: "18px" } }}
            InputLabelProps={{ style: { color: "white", fontSize: "18px" } }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              marginTop: 3,
              backgroundColor: "red",
            }}
            disabled={!rating || !newComment}
          >
            ENVIAR
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default EvaluationPage;