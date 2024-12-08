import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  IconButton,
  CircularProgress,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { fetchAccountById, updateAccount, deleteAccount } from "../../services/api";
import useAuth from "../contexts/useAuth";

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
  const { user, logout } = useAuth(); // Obtemos o usuário logado
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!user?.id) {
          navigate("/login");
          return;
        }

        const data = await fetchAccountById(user.id);
        if (data) {
          setFormData(data);
        } else {
          throw new Error("Usuário não encontrado");
        }
      } catch (err) {
        console.error("Erro ao carregar os dados do usuário:", err.message);
        setError("Usuário não encontrado.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateAccount(user.id, formData);
      setIsEditing(false);
    } catch (err) {
      console.error("Erro ao atualizar conta:", err.message);
      setError("Erro ao atualizar a conta.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccount(user.id);
      logout();
      navigate("/");
    } catch (err) {
      console.error("Erro ao excluir conta:", err.message);
      setError("Erro ao excluir a conta.");
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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
        bgcolor: "var(--bg-page-color)",
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
          <Box sx={{ textAlign: "left" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "left",
                gap: "1em",
                backgroundColor: "var(--bg-color)",
                borderRadius: "5px",
                padding: "24px 12px",
                marginBottom: "64px",
              }}
            >
              <Avatar
                sx={{
                  width: "2.8em",
                  height: "2.8em",
                  border: "2px solid #fff",
                  bgcolor: "#000",
                }}
              />
              <Box sx={{ padding: "0px" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {formData.username}
                </Typography>
                <Typography variant="body2" sx={{ color: "#A5A5A5" }}>
                  {formData.email}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              onClick={() => setIsEditing(true)}
              sx={{
                width: "100%",
                maxWidth: "388px",
                bgcolor: "var(--btn-mangak-color)",
                marginBottom: "3em",
              }}
            >
              Editar dados
            </Button>
            <Button
              variant="contained"
              onClick={handleOpenDialog}
              sx={{
                width: "100%",
                maxWidth: "388px",
                bgcolor: "var(--btn-mangak-color)",
                marginBottom: "2em",
              }}
            >
              Excluir conta
            </Button>
          </Box>
        )}

        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{
            position: "absolute",
            bottom: "16px",
            width: "100%",
            maxWidth: "290.52px",
            bgcolor: "var(--btn-mangak-color)",
          }}
        >
          Sair da Conta
        </Button>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmação de exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza de que deseja excluir sua conta? Essa ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProfilePage;