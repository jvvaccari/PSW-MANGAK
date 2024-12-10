import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Typography, Box, TextField, Button, Paper, IconButton, InputAdornment, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useAuth from "../contexts/useAuth";
import backgroundImage from "../assets/img/login-background.jpg";

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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
  
    setLoading(true);
    setError(null);
    try {
      console.log("Tentando login com", email, password);
      const user = await login(email, password); // Chama a função login do contexto
  
      if (user && user.id) {
        console.log("Usuário logado com sucesso:", user);
        navigate("/"); // Redireciona para o catálogo
      }
    } catch (err) {
      console.error("Erro ao realizar login:", err.message);
      setError(err.message || "Erro ao realizar login. Tente novamente.");
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
          padding: "0",
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
            onClick={() => navigate("/register")}
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
            Cadastrar
          </Button>
        </Box>

        {/* Login Form Centered */}
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
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null); // Reseta erro ao digitar
              }}
              sx={{
                marginBottom: "16px",
                "& .MuiInputBase-root": {
                  bgcolor: "#1E1E1E", // Fundo consistente
                  color: "#FFFFFF", // Cor do texto
                },
                "& .MuiOutlinedInput-root": {
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FF0037", // Borda no hover
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FF0037", // Borda no foco
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#FFFFFF", // Cor do label
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#FFFFFF", // Cor do label no foco
                },
              }}
            />  

              <TextField
                fullWidth
                label="Senha"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null); // Reseta erro ao digitar
                }}
                sx={{
                  marginBottom: "24px",
                  "& .MuiInputBase-root": {
                    bgcolor: "#1E1E1E",
                    color: "#FFFFFF",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#FFFFFF",
                  },
                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FF0037",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FF0037",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "#FFFFFF" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {error && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ marginBottom: "16px" }}
                >
                  {error}
                </Typography>
              )}

              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                sx={{
                  padding: "3%",
                  fontWeight: "bold",
                  fontSize: "4vw",
                  borderRadius: "8px",
                  "&:hover": {
                    bgcolor: "#CC002A",
                  },
                  "@media (min-width: 600px)": {
                    padding: "10px 0",
                    fontSize: "1rem",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Entrar"}
              </Button>
            </form>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}