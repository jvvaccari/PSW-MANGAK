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
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { ThumbUp, ThumbDown, Reply, ArrowBack } from "@mui/icons-material";
import useAuth from "../contexts/useAuth";
import {
  fetchComments,
  postComment,
  updateCommentReaction,
  fetchReplies,
  postReply,
} from "../../services/api";

const CommentsPage = () => {
  const { mangaId } = useParams();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({});
  const [replyText, setReplyText] = useState({});
  const [newComment, setNewComment] = useState("");
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

  const handleReaction = async (commentId, type) => {
    try {
      const updatedComment = await updateCommentReaction(mangaId, commentId, type);
      setComments((prev) =>
        prev.map((comment) => (comment.id === commentId ? updatedComment : comment))
      );
    } catch (err) {
      console.error(`Erro ao ${type === "like" ? "curtir" : "descurtir"} comentário:`, err.message);
    }
  };

  const loadReplies = async (commentId) => {
    if (replies[commentId]) return;

    try {
      const fetchedReplies = await fetchReplies(mangaId, commentId);
      setReplies((prev) => ({ ...prev, [commentId]: fetchedReplies }));
    } catch (err) {
      console.error("Erro ao carregar respostas:", err.message);
    }
  };

  const handlePostReply = async (commentId) => {
    if (!replyText[commentId]?.trim()) return;

    const replyData = {
      text: replyText[commentId],
      userId: user.id,
      timestamp: new Date().toISOString(),
    };

    try {
      const createdReply = await postReply(mangaId, commentId, replyData);
      setReplies((prev) => ({
        ...prev,
        [commentId]: [...(prev[commentId] || []), createdReply],
      }));
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
    } catch (err) {
      console.error("Erro ao postar resposta:", err.message);
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
        }}
      >
        <CircularProgress sx={{ color: "var(--primary-color)" }} />
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
        }}
      >
        <Typography variant="subtitle1">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "16px",
        maxWidth: "320px",
        height: "568px",
        margin: "0 auto",
        backgroundColor: "var(--background-color)",
        overflowY: "auto",
      }}
    >
      {/* Back Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ color: "var(--icon-color)" }}
        >
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            textAlign: "center",
            color: "var(--text-color)",
          }}
        >
          Comentários
        </Typography>
      </Box>

      {/* Comment Input */}
      <TextField
        fullWidth
        label="Escreva um comentário..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        variant="outlined"
        margin="normal"
        sx={{
          backgroundColor: "var(--input-bg-color)",
          borderRadius: "4px",
        }}
      />
      <Button
        variant="contained"
        onClick={handlePostComment}
        sx={{
          width: "100%",
          backgroundColor: "#ff0000",
          color: "var(--text-color)",
          "&:hover": { backgroundColor: "#cc0000" },
          marginBottom: "16px",
        }}
      >
        Postar Comentário
      </Button>

      {/* Comments List */}
      <List>
        {comments.map((comment) => (
          <div key={comment.id}>
            <Card
              variant="outlined"
              sx={{
                marginY: 2,
                backgroundColor: "var(--card-bg-color)",
                color: "var(--text-color)",
              }}
            >
              <CardContent>
                <Typography variant="body1">{comment.text}</Typography>
                <Typography
                  variant="caption"
                  color="var(--secondary-text-color)"
                >
                  {new Date(comment.timestamp).toLocaleString()}
                </Typography>
                <Box sx={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <IconButton
                    onClick={() => handleReaction(comment.id, "like")}
                    sx={{ color: "var(--icon-color)" }}
                  >
                    <ThumbUp />
                  </IconButton>
                  <IconButton
                    onClick={() => handleReaction(comment.id, "dislike")}
                    sx={{ color: "var(--icon-color)" }}
                  >
                    <ThumbDown />
                  </IconButton>
                  <IconButton
                    onClick={() => loadReplies(comment.id)}
                    sx={{ color: "var(--icon-color)" }}
                  >
                    <Reply />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>

            {replies[comment.id] && (
              <List sx={{ pl: 4 }}>
                {replies[comment.id].map((reply) => (
                  <ListItem key={reply.id}>
                    <ListItemText
                      primary={reply.text}
                      secondary={new Date(reply.timestamp).toLocaleString()}
                      sx={{ color: "var(--text-color)" }}
                    />
                  </ListItem>
                ))}
                <TextField
                  fullWidth
                  label="Escreva uma resposta..."
                  value={replyText[comment.id] || ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({ ...prev, [comment.id]: e.target.value }))
                  }
                  variant="outlined"
                  margin="normal"
                  sx={{
                    backgroundColor: "var(--input-bg-color)",
                    borderRadius: "4px",
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => handlePostReply(comment.id)}
                  sx={{
                    backgroundColor: "#ff0000",
                    color: "var(--btn-text-color)",
                    "&:hover": { backgroundColor: "#cc0000" },
                  }}
                >
                  Responder
                </Button>
              </List>
            )}
          </div>
        ))}
      </List>
    </Box>
  );
};

export default CommentsPage;
