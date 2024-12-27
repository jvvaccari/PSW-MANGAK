import { useState, useEffect, useContext } from "react";
import { Box, Typography, TextField, Container, Button, Rating, Avatar } from "@mui/material";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { updateEvaluation, deleteEvaluation, fetchEvaluations } from "../../services/api";
import UserContext from "../contexts/UserContext"; // Para acessar o userId

export default function EvaluationPage() {
  const { mangaId } = useParams();
  const [manga, setManga] = useState(null);
  const [author, setAuthor] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0.0);
  const [loading, setLoading] = useState(true);
  const { userId } = useContext(UserContext); // Obtendo o userId do contexto
  const [editingId, setEditingId] = useState(null); // ID do comentário sendo editado

  // Buscar dados do mangá e avaliações
  useEffect(() => {
    const fetchMangaAndEvaluations = async () => {
      try {
        const mangaResponse = await fetch(`http://localhost:5001/mangas/${mangaId}`);
        if (!mangaResponse.ok) throw new Error("Erro ao buscar o mangá.");
        const mangaData = await mangaResponse.json();
        setManga(mangaData);

        const authorResponse = await fetch(`http://localhost:5001/authors/${mangaData.authorId}`);
        const authorData = authorResponse.ok ? await authorResponse.json() : { name: "Autor desconhecido" };
        setAuthor(authorData.name);

        const evaluations = await fetchEvaluations(mangaId);
        setComments(evaluations);

        const average = evaluations.length > 0
          ? (evaluations.reduce((acc, evaluation) => acc + evaluation.rating, 0) / evaluations.length).toFixed(1)
          : 0.0;
        setAverageRating(average);
      } catch (error) {
        console.error("Erro ao buscar mangá ou avaliações:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMangaAndEvaluations();
  }, [mangaId]);

  // Salvar ou atualizar comentário
  const handleSaveComment = async () => {
    if (!newComment.trim() || newRating === 0) {
      alert("Preencha todos os campos antes de salvar.");
      return;
    }

    if (editingId) {
      // Atualizar comentário existente
      const updatedEvaluation = {
        mangaId,
        rating: newRating,
        comment: newComment,
        timestamp: new Date().toISOString(),
      };

      try {
        const updatedData = await updateEvaluation(editingId, updatedEvaluation);
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === editingId ? { ...comment, ...updatedData } : comment
          )
        );
        setEditingId(null); // Finaliza o modo de edição
      } catch (error) {
        console.error("Erro ao editar avaliação:", error.message);
        alert("Erro ao editar avaliação.");
      }
    } else {
      // Adicionar novo comentário
      const newEntry = {
        mangaId,
        userId,
        rating: newRating,
        comment: newComment,
        timestamp: new Date().toISOString(),
      };

      try {
        const response = await fetch("http://localhost:5001/evaluations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEntry),
        });

        if (!response.ok) throw new Error("Erro ao adicionar avaliação.");
        const createdEvaluation = await response.json();
        setComments([createdEvaluation, ...comments]);
      } catch (error) {
        console.error("Erro ao adicionar avaliação:", error.message);
        alert("Erro ao adicionar avaliação.");
      }
    }

    // Reseta os campos
    setNewComment("");
    setNewRating(0);
  };

  // Entrar no modo de edição
  const handleEdit = (evaluation) => {
    setEditingId(evaluation.id);
    setNewComment(evaluation.comment);
    setNewRating(evaluation.rating);
  };

  // Excluir avaliação
  const handleDeleteEvaluation = async (evaluationId) => {
    const evaluation = comments.find((comment) => comment.id === evaluationId);

    if (evaluation.userId !== userId) {
      alert("Você não pode excluir avaliações de outros usuários.");
      return;
    }

    try {
      await deleteEvaluation(evaluationId);
      setComments(comments.filter((comment) => comment.id !== evaluationId));
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error.message);
    }
  };

  if (loading) {
    return <div style={{ color: "white", textAlign: "center", padding: "20px" }}>Carregando...</div>;
  }

  if (!manga) {
    return <div style={{ color: "white", textAlign: "center", padding: "20px" }}>Mangá não encontrado.</div>;
  }

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4, color: "#fff", backgroundColor: "#000", padding: "1em" }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: "#fff", fontWeight: "bold" }}>
            {manga.title}
          </Typography>
          <Typography variant="h6" sx={{ color: "#ccc" }}>{author}</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
          <Typography variant="h5" sx={{ color: "#EC7C01" }}>{averageRating}</Typography>
          <Rating name="read-only" value={parseFloat(averageRating)} precision={0.1} readOnly sx={{ color: "#EC7C01" }} />
          <Typography variant="body2" sx={{ color: "#ccc" }}>({comments.length} avaliações)</Typography>
        </Box>

        <Box sx={{ mb: 4, p: 3, backgroundColor: "var(--bg-color)", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
          <Typography variant="h6" sx={{ color: "#fff", mb: 2, fontWeight: "bold", textAlign: "center" }}>
            {editingId ? "Editar Avaliação" : "Avalie e comente"}
          </Typography>
          <Rating
            name="rating-controlled"
            value={newRating}
            precision={0.5}
            size="large"
            onChange={(event, newValue) => setNewRating(newValue)}
            sx={{ "& .MuiRating-iconEmpty": { color: "#EC7C01" }, "& .MuiRating-iconFilled": { color: "#EC7C01" }, fontSize: "2rem" }}
          />
          <TextField
            label="Escreva um comentário"
            variant="outlined"
            fullWidth
            multiline
            minRows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{
              mt: 2,
              backgroundColor: "#1e1e1e",
              "& .MuiInputBase-root": { color: "#fff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#FF0037" },
                "&.Mui-focused fieldset": { borderColor: "#FF0037" },
              },
              "& .MuiInputLabel-root": { color: "#ccc" },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSaveComment}
            sx={{
              mt: 2,
              backgroundColor: "#FF0037",
              color: "#fff",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#CC002A" },
            }}
            disabled={!newComment || !newRating}
          >
            {editingId ? "Salvar" : "Enviar"}
          </Button>
        </Box>

        <Box>
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ mb: 3, borderBottom: "1px solid #444", pb: 2, color: "#fff" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 2 }}>
                <Avatar alt={`Usuário ${comment.userId}`} src={comment.avatar || ""} />
                <Box>
                  <Typography variant="subtitle1" sx={{ color: "#fff" }}>Usuário {comment.userId}</Typography>
                  <Typography variant="caption" sx={{ color: "#fff" }}>{new Date(comment.timestamp).toLocaleString()}</Typography>
                </Box>
              </Box>
              <Rating name={`rating-${comment.id}`} value={comment.rating} precision={0.5} readOnly sx={{ color: "#EC7C01" }} />
              <Typography variant="body2" sx={{ mt: 1, color: "#ccc" }}>{comment.comment}</Typography>

              {comment.userId === userId && (
                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "#FF0037",
                      borderColor: "#FF0037",
                      "&:hover": {
                        backgroundColor: "#FF0037",
                        color: "#fff",
                      },
                    }}
                    onClick={() => handleEdit(comment)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "#FF0037",
                      borderColor: "#FF0037",
                      "&:hover": {
                        backgroundColor: "#FF0037",
                        color: "#fff",
                      },
                    }}
                    onClick={() => handleDeleteEvaluation(comment.id)}
                  >
                    Excluir
                  </Button>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Container>
    </>
  );
}
