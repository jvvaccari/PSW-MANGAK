import { useState } from "react";
import { Typography, Box, Button, Paper, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/authSlice"; 
import backgroundImage from "../assets/img/login-background.jpg";
import StyledTextField from "../components/StyledTextField";
import Navbar from "../components/Navbar";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: reduxError } = useSelector((state) => state.auth);

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
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Por favor, insira um email válido.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setError(null);

    dispatch(registerUser({ username, email, password }))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        setError(err.message || "Erro ao registrar. Tente novamente.");
      });
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
      <Navbar />

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
              onChange={(e) => {
                setUsername(e.target.value);
                setError(null);
              }}
              fullWidth
              required
            />
            <StyledTextField
              label="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              fullWidth
              required
            />
            <StyledTextField
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              fullWidth
              required
            />
            <StyledTextField
              label="Confirmar Senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError(null);
              }}
              fullWidth
              required
            />
            {(error || reduxError) && (
              <Typography
                variant="body2"
                color="error"
                sx={{ marginBottom: "16px" }}
              >
                {error || reduxError}
              </Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              type="submit"
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
                  fontSize: "1rem",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Registrar"
              )}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}
