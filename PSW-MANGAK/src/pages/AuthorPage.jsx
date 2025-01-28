import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { AuthorAPI } from "../../services/api";

export default function AuthorDetails() {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuthor = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await AuthorAPI.fetchById(authorId);
        setAuthor(data);
      } catch (err) {
        console.error("Erro ao carregar o autor:", err.message);
        setError("Erro ao carregar as informações do autor. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [authorId]);

  if (loading) {
    return (
      <Box sx={{ color: "white", textAlign: "center", padding: "20px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: "white", textAlign: "center", padding: "20px" }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!author) {
    return (
      <Box sx={{ color: "white", textAlign: "center", padding: "20px" }}>
        Autor não encontrado.
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4, color: "#fff", backgroundColor: "#000", padding: "2em", borderRadius: "8px" }}>

        <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 4 }}>
          <Avatar
            alt={author.name}
            src={author.authorPhoto}
            sx={{ width: 150, height: 150 }}
          />
          <Typography variant="h3" sx={{ fontWeight: "bold", color: "#FF0037" }}>
            {author.name}
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold", mb: 1 }}>
            Informações Básicas
          </Typography>
          <Typography variant="body1" sx={{ color: "#ccc" }}>
            <strong>Pseudônimo:</strong> {author.pseudonym}
          </Typography>
          <Typography variant="body1" sx={{ color: "#ccc" }}>
            <strong>Data de Nascimento:</strong> {new Date(author.birthDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" sx={{ color: "#ccc" }}>
            <strong>Local de Nascimento:</strong> {author.birthPlace}
          </Typography>
          <Typography variant="body1" sx={{ color: "#ccc" }}>
            <strong>Nacionalidade:</strong> {author.nationality}
          </Typography>
          <Typography variant="body1" sx={{ color: "#ccc" }}>
            <strong>Etnia:</strong> {author.ethnicity}
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold", mb: 1 }}>
            Ocupações
          </Typography>
          <ul>
            {author.occupations.map((occupation, index) => (
              <li key={index}>
                <Typography variant="body1" sx={{ color: "#ccc" }}>
                  {occupation}
                </Typography>
              </li>
            ))}
          </ul>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold", mb: 1 }}>
            Obras Notáveis
          </Typography>
          <ul>
            {author.notableWorks.map((work, index) => (
              <li key={index}>
                <Typography variant="body1" sx={{ color: "#ccc" }}>
                  {work}
                </Typography>
              </li>
            ))}
          </ul>
        </Box>

        <Box>
          <Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold", mb: 1 }}>
            Biografia
          </Typography>
          <Typography variant="body1" sx={{ color: "#ccc", textAlign: "justify" }}>
            {author.biography}
          </Typography>
        </Box>
      </Container>
    </>
  );
}
