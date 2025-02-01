import { useState,useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/authSlice";
import backgroundImage from "../assets/img/login-background.jpg";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/"); 
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {

      const result = await dispatch(loginUser({ email, password })).unwrap();
      console.log("Login Bem-sucedido", result);
      navigate("/dashboard"); // Substitua por sua rota pós-login.
    } catch (err) {
      console.error("Erro ao tentar login:", err);
      alert("Erro: " + (err.message || "Erro desconhecido"));
    }
  };


  const commonInputStyles = {
    marginBottom: "16px",
    "& .MuiInputBase-root": {
      bgcolor: "#1E1E1E",
      color: "#FFFFFF",
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FF0037",
    },
    "& .MuiInputLabel-root": {
      color: "#fff",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: `url(${backgroundImage}) center/cover no-repeat`,
      }}
    >
      <Navbar />
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
            bgcolor: "#2C2C2C", // Definir um valor fixo para evitar dependência de variáveis CSS.
            width: "90%",
            maxWidth: "400px",
            textAlign: "center",
            borderTop: "4px solid #FF0037",
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={commonInputStyles}
            />
            <TextField
              fullWidth
              label="Senha"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ ...commonInputStyles, marginBottom: "24px" }}
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
              disabled={loading}
              type="submit"
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
              {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Entrar"}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}
