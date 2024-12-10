import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  List,
  CircularProgress,
} from "@mui/material";
import { ThumbUp, ThumbDown, ArrowBack, Edit, Delete } from "@mui/icons-material";
import useAuth from "../contexts/useAuth";
import {
  fetchComments,
  postComment,
  updateCommentReaction,
  deleteComment,
  updateComment,
} from "../../services/api";

const CommentsPage = () => {
  const { mangaId } = useParams();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadComments = async () => {
      if (!user) {
        setError("Você precisa estar logado para acessar os comentários.");
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        const fetchedComments = await fetchComments(mangaId);
        setComments(fetchedComments);
      } catch (err) {
        console.error("Erro ao carregar comentários:", err.message);
        setError("Erro ao carregar os comentários.");
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [user, mangaId, navigate]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    const commentData = {
      text: newComment,
      userId: user.id,
      timestamp: new Date().toISOString(),
    };

    try {
      const createdComment = await postComment(mangaId, commentData);
      setComments((prev) => [...prev, createdComment]);
      setNewComment("");
    } catch (err) {
      console.error("Erro ao postar comentário:", err.message);
      setError("Erro ao postar comentário.");
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const updatedComment = await updateComment(mangaId, commentId, editText);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? updatedComment : comment
        )
      );
      setEditingCommentId(null);
      setEditText("");
    } catch (err) {
      console.error("Erro ao editar comentário:", err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(mangaId, commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (err) {
      console.error("Erro ao excluir comentário:", err.message);
    }
  };

  const handleReaction = async (commentId, type) => {
    try {
      const updatedComment = await updateCommentReaction(mangaId, commentId, type);
      setComments((prev) =>
        prev.map((comment) => (comment.id === commentId ? updatedComment : comment))
      );
    } catch (err) {
      console.error(
        `Erro ao ${type === "like" ? "curtir" : "descurtir"} comentário:`,
        err.message
      );
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "var(--bg-page-color)",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
          color: "red",
          padding: "var(--spacing-medium)",
          backgroundColor: "var(--bg-page-color)",
        }}
      >
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "var(--spacing-medium)",
        maxWidth: "700px",
        margin: "var(--spacing-medium) auto",
        backgroundColor: "var(--bg-data-color)",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "var(--spacing-medium)",
        }}
      >
        <IconButton onClick={() => navigate(-1)} sx={{ color: "var(--text-color)" }}>
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            textAlign: "center",
            color: "var(--text-color)",
            fontWeight: "bold",
          }}
        >
          Comentários
        </Typography>
      </Box>

      {/* Campo para adicionar comentários */}
      <Box sx={{ marginBottom: "var(--spacing-medium)" }}>
        <TextField
          fullWidth
          label="Escreva um comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          variant="outlined"
          multiline
          minRows={3}
          sx={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            marginBottom: "var(--spacing-small)",
          }}
        />
        <Button
          variant="contained"
          onClick={handlePostComment}
          sx={{
            backgroundColor: "var(--btn-mangak-color)",
            color: "var(--text-color)",
            "&:hover": { backgroundColor: "#e6002e" },
            borderRadius: "8px",
            padding: "10px 16px",
            fontWeight: "bold",
          }}
        >
          Postar Comentário
        </Button>
      </Box>

      {/* Lista de Comentários */}
      <List>
        {comments.map((comment) => (
          <Box key={comment.id}>
            <Card
              sx={{
                backgroundColor: "var(--bg-data-color)",
                borderRadius: "8px",
                padding: "var(--spacing-medium)",
                marginBottom: "var(--spacing-small)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                {editingCommentId === comment.id ? (
                  <>
                    <TextField
                      fullWidth
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      sx={{ marginBottom: "8px", backgroundColor: "#fff" }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleEditComment(comment.id)}
                      sx={{ marginRight: "8px" }}
                    >
                      Salvar
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setEditingCommentId(null)}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="body1" sx={{ color: "var(--text-color)" }}>
                      {comment.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", marginTop: "var(--spacing-small)" }}
                    >
                      {new Date(comment.timestamp).toLocaleString()}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "var(--spacing-small)",
                      }}
                    >
                      <IconButton
                        onClick={() => handleReaction(comment.id, "like")}
                        sx={{ color: "var(--rating-color)" }}
                      >
                        <ThumbUp />
                      </IconButton>
                      <IconButton
                        onClick={() => handleReaction(comment.id, "dislike")}
                        sx={{ color: "var(--status-red)" }}
                      >
                        <ThumbDown />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditText(comment.text);
                        }}
                        sx={{ color: "var(--text-color)" }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteComment(comment.id)}
                        sx={{ color: "var(--status-red)" }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default CommentsPage;