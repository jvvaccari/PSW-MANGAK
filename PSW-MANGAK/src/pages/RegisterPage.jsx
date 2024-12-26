import { useState } from "react";
import { Typography, Box, Button, Paper, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types"; 
import useAuth from "../contexts/useAuth";
import backgroundImage from "../assets/img/login-background.jpg";
import StyledTextField from "../components/StyledTextField";
import Navbar from "../components/Navbar";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !username || !confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log("Tentando registrar com", username, email, password);
      await register({ username, email, password });
      navigate("/");
    } catch (err) {
      console.error("Erro ao registrar:", err.message);
      setError(err.message || "Erro ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#000000",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
     <Navbar/>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: "5%",
            borderRadius: "8px",
            bgcolor: "var(--bg-color)",
            width: "90%",
            maxWidth: "400px",
            textAlign: "center",
            borderTop: "4px solid #FF0037",
            "@media (min-width: 768px)": {
              width: "50%",
              maxWidth: "500px",
            },
            "@media (min-width: 1024px)": {
              width: "40%",
              maxWidth: "600px",
            },
          }}
        >
          <form onSubmit={handleSubmit}>
            <StyledTextField
              label="Nome de Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <StyledTextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <StyledTextField
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <StyledTextField
              label="Confirmar Senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && (
              <Typography variant="body2" color="error" sx={{ marginBottom: "16px" }}>
                {error}
              </Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: "#FF0037",
                color: "#fff",
                padding: "3%",
                fontWeight: "bold",
                fontSize: "4vw",
                borderRadius: "8px",
                "&:hover": { bgcolor: "#CC002A" },
                "@media (min-width: 600px)": {
                  padding: "10px 0",
                  fontSize: "1rem",}}}
                  onclick={handleSubmit}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Registrar"}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}

RegisterPage.propTypes = {
  mangas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
    })
  ).isRequired,
};
