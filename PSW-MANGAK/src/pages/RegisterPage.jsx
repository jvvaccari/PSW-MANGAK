import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Typography, Box, TextField, Button, Paper, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../contexts/useAuth";
import backgroundImage from "../assets/img/login-background.jpg";
import StyledTextField from "../components/StyledTextField"; 

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF0037",
    },
    background: {
      default: "#000000",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#CCCCCC",
    },
  },
  typography: {
    h5: {
      fontWeight: 700,
      fontSize: "1.8rem",
      color: "#FFFFFF",
    },
    body1: {
      fontSize: "1rem",
      color: "#CCCCCC",
    },
  },
});



export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth(); // Função de registro do contexto
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
      await register({ username, email, password }); // Chama a função register do contexto
      navigate("/"); // Redireciona para o catálogo
    } catch (err) {
      console.error("Erro ao registrar:", err.message);
      setError(err.message || "Erro ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Top Navigation Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "3% 5%",
            bgcolor: "transparent",
          }}
        >
          <Typography
            component="a"
            sx={{
              fontWeight: "bold",
              color: "#FF0037",
              fontSize: "6vw",
              textDecoration: "none",
              "@media (min-width: 600px)": {
                fontSize: "1.8rem",
              },
            }}
          >
            MANGAK
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/login")}
            sx={{
              fontWeight: "bold",
              padding: "2% 5%",
              fontSize: "3.5vw",
              borderRadius: "6px",
              "&:hover": {
                bgcolor: "#CC002A",
              },
              "@media (min-width: 600px)": {
                padding: "6px 16px",
                fontSize: "0.875rem",
              },
            }}
          >
            Login
          </Button>
        </Box>


        {/* Register Form Centered */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "5%",
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
                color="primary"
                type="submit"
                disabled={loading}
                sx={{ padding: "3%", fontWeight: "bold", fontSize: "1rem" }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Registrar"}
              </Button>
            </form>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
