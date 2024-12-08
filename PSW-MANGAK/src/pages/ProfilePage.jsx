import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  IconButton,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { fetchAccountById, updateAccount, deleteAccount } from "../../services/api";
import PropTypes from "prop-types";

const inputStyles = {
  bgcolor: "var(--bg-data-color)",
  borderRadius: "5px",
  marginBottom: "16px",
  "& .MuiFilledInput-root": {
    color: "#fff",
    "&:before": { borderBottom: "none" },
    "&:after": { borderBottom: "2px solid #fff" },
    "&:hover:not(.Mui-disabled):before": { borderBottom: "2px solid #fff" },
  },
  "& .MuiInputLabel-root": {
    color: "#fff",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#fff",
  },
};

function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchAccountById(id);
        if (data) {
          setUser(data);
          setFormData(data);
        } else {
          throw new Error("Usuário não encontrado");
        }
      } catch (err) {
        console.error("Erro ao carregar os dados do usuário:", err);
        setError("Usuário não encontrado");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    loadUser();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateAccount(id, formData);
      setUser(formData);
      setIsEditing(false);
      console.log("Conta atualizada com sucesso");
    } catch (err) {
      console.error("Erro ao atualizar conta:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccount(id);
      console.log("Conta excluída com sucesso");
      navigate("/");
    } catch (err) {
      console.error("Erro ao excluir conta:", err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography
        sx={{
          textAlign: "center",
          marginTop: "20px",
          color: "red",
          fontSize: "1.2em",
        }}
      >
        {error}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "var(--bg-color)",
      }}
    >
      <Box
        sx={{
          bgcolor: "var(--bg-page-color)",
          padding: "16px",
          color: "#fff",
          maxWidth: "700px",
          width: "100%",
          minHeight: "100vh",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          aria-label="Fechar"
          sx={{ position: "absolute", top: "8px", right: "8px", color: "#fff" }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" sx={{ marginBottom: "2em", textAlign: "center" }}>
          Conta
        </Typography>

        {isEditing ? (
          <Box sx={{ maxWidth: "388px" }}>
            <TextField
              label="Nome"
              variant="filled"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              fullWidth
              sx={inputStyles}
            />
            <TextField
              label="Email"
              variant="filled"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              sx={inputStyles}
            />
            <TextField
              label="Senha"
              variant="filled"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              type={showPassword ? "text" : "password"}
              fullWidth
              sx={inputStyles}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      sx={{ color: "#fff" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "32px" }}>
              <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "var(--btn-mangak-color)" }}>
                Salvar
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsEditing(false)}
                sx={{ color: "var(--btn-mangak-color)", borderColor: "var(--btn-mangak-color)" }}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <Avatar
              sx={{
                width: "60px",
                height: "60px",
                margin: "0 auto 16px",
                border: "2px solid #fff",
                bgcolor: "#000",
              }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {user.username}
            </Typography>
            <Typography variant="body2" sx={{ color: "#A5A5A5", marginBottom: "32px" }}>
              {user.email}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setIsEditing(true)}
              sx={{
                width: "100%",
                maxWidth: "388px",
                bgcolor: "var(--btn-mangak-color)",
                marginBottom: "16px",
              }}
            >
              Editar dados
            </Button>
            <Button
              variant="contained"
              onClick={handleDelete}
              sx={{ width: "100%", maxWidth: "388px", bgcolor: "var(--btn-mangak-color)" }}
            >
              Excluir conta
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

ProfilePage.propTypes = {
  userId: PropTypes.string,
};

export default ProfilePage;