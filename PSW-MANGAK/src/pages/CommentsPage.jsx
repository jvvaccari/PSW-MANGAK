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
  fetchUserById,
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

        // Adiciona o username a cada comentário, se necessário
        const commentsWithUsernames = await Promise.all(
          fetchedComments.map(async (comment) => {
            if (!comment.username) {
              const userData = await fetchUserById(comment.userId);
              return { ...comment, username: userData.name || `Usuário ${comment.userId}` };
            }
            return comment;
          })
        );

        setComments(commentsWithUsernames);
      } catch (err) {
        console.error("Erro ao carregar os comentários:", err);
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
      setComments((prev) => [
        ...prev,
        { ...createdComment, username: user.name || user.username || `Usuário ${user.id}` },
      ]);
      setNewComment("");
    } catch (err) {
      console.error("Erro ao postar comentário:", err);
      setError("Erro ao postar comentário.");
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const updatedComment = await updateComment(mangaId, commentId, editText);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...updatedComment, username: comment.username }
            : comment
        )
      );
      setEditingCommentId(null);
      setEditText("");
    } catch (err) {
      console.error("Erro ao editar comentário:", err);
      setError("Erro ao editar comentário.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(mangaId, commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (err) {
      console.error("Erro ao excluir comentário:", err);
      setError("Erro ao excluir comentário.");
    }
  };

  const handleReaction = async (commentId, type) => {
    try {
      const updatedComment = await updateCommentReaction(mangaId, commentId, type);
      setComments((prev) =>
        prev.map((comment) => (comment.id === commentId ? updatedComment : comment))
      );
    } catch (err) {
      console.error(`Erro ao ${type === "like" ? "curtir" : "descurtir"} comentário:`, err);
      setError(`Erro ao ${type === "like" ? "curtir" : "descurtir"} comentário.`);
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
          backgroundColor: "#121212",
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
          padding: "16px",
          backgroundColor: "#121212",
        }}
      >
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "24px",
        maxWidth: "700px",
        margin: "auto",
        backgroundColor: "#1E1E1E",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: "#FFF" }}>
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h5"
          sx={{ flexGrow: 1, textAlign: "center", color: "#FFF" }}
        >
          Comentários
        </Typography>
      </Box>

      <List>
        {comments.map((comment) => (
          <Card
            key={comment.id}
            sx={{
              backgroundColor: "#2C2C2C",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{ color: "#FF0037", fontWeight: "bold", marginBottom: "8px" }}
              >
                {comment.username}
              </Typography>
              {editingCommentId === comment.id ? (
                <>
                  <TextField
                    fullWidth
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    sx={{
                      marginBottom: "8px",
                      backgroundColor: "#FFF",
                      borderRadius: "4px",
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleEditComment(comment.id)}
                    sx={{
                      backgroundColor: "#FF0037",
                      color: "#FFF",
                      "&:hover": { backgroundColor: "#E6002E" },
                      marginRight: "8px",
                    }}
                  >
                    Salvar
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setEditingCommentId(null)}
                    sx={{
                      color: "#FF0037",
                      borderColor: "#FF0037",
                      "&:hover": {
                        backgroundColor: "rgba(230, 0, 46, 0.1)",
                      },
                    }}
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="body1" sx={{ color: "#FFF" }}>
                    {comment.text}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#A5A5A5" }}>
                    {new Date(comment.timestamp).toLocaleString()}
                  </Typography>
                  <Box sx={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <IconButton
                      onClick={() => handleReaction(comment.id, "like")}
                      sx={{ color: "#FFF" }}
                    >
                      <ThumbUp />
                    </IconButton>
                    <IconButton
                      onClick={() => handleReaction(comment.id, "dislike")}
                      sx={{ color: "#FF0037" }}
                    >
                      <ThumbDown />
                    </IconButton>
                    {comment.userId === user.id && (
                      <>
                        <IconButton
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditText(comment.text);
                          }}
                          sx={{ color: "#FFF" }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteComment(comment.id)}
                          sx={{ color: "#FF0037" }}
                        >
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </List>

      <Box>
        <TextField
          fullWidth
          label="Escreva um comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          variant="outlined"
          multiline
          minRows={3}
          sx={{
            backgroundColor: "#FFF",
            borderRadius: "8px",
            marginBottom: "8px",
          }}
        />
        <Button
          variant="contained"
          onClick={handlePostComment}
          sx={{
            backgroundColor: "#FF0037",
            color: "#FFF",
            "&:hover": { backgroundColor: "#E6002E" },
            borderRadius: "8px",
            padding: "10px 16px",
            fontWeight: "bold",
          }}
        >
          Postar Comentário
        </Button>
      </Box>
    </Box>
  );
};

export default CommentsPage;