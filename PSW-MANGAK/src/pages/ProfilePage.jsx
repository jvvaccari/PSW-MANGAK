import Header from "../components/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, TextField, Avatar } from "@mui/material";
import {
  fetchAccountById,
  updateAccount,
  deleteAccount,
} from "../../services/api";
import PropTypes from "prop-types";

function ProfilePage({ userId }) {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchAccountById(userId);
        setUser(data);
        setFormData(data);
      } catch (err) {
        console.error("Erro ao carregar os dados do usuário:", err);
      }
    };

    loadUser();
  }, [userId]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateAccount(userId, formData);
      setUser(formData);
      setIsEditing(false);
    } catch (err) {
      console.error("Erro ao atualizar conta:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccount(userId);
      navigate("/login");
    } catch (err) {
      console.error("Erro ao excluir conta:", err);
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  if (!user) return <Typography>Carregando...</Typography>;

  const inputStyles = {
    bgcolor: "var(--bg-data-color)",
    borderRadius: "5px",
    marginBottom: "32px",
    "& .MuiFilledInput-root": {
      color: "#fff", // Altera a cor do texto digitado para branco
      "&:before": { borderBottom: "none" },
      "&:after": { borderBottom: "2px solid #fff" },
      "&:hover:not(.Mui-disabled):before": {
        borderBottom: "1px solid #fff",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#fff",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#fff",
    },
  };

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
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Typography
            variant="h5"
            sx={{
              marginBottom: "32px",
              textAlign: "center",
            }}
          >
            Conta
          </Typography>
          <Header />
        </Box>
        {isEditing ? (
          <Box sx={{ width: "388px" }}>
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
              fullWidth
              sx={inputStyles}
            />
            <Box sx={{ display: "flex", justifyContent: "center",marginTop: "32px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{
                  marginRight: "8px",
                  bgcolor: "var(--btn-mangak-color)",
                  "&:hover": {
                    bgcolor: "darkred",
                  },
                }}
              >
                Salvar
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  color: "var(--btn-mangak-color)",
                  borderColor: "var(--btn-mangak-color)",
                  "&:hover": {
                    borderColor: "darkred",
                    bgcolor: "rgba(255, 0, 0, 0.1)",
                  },
                }}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "0.8em",
                alignItems: "center",
                borderRadius: "5px",
                bgcolor: "var(--bg-data-color)",
                width: "60%",
                minWidth: "288px",
                maxWidth: "388px",
                height: "60px",
                padding: "36px 12px",
                margin: "0 auto",
              }}
            >
              <Avatar
                sx={{
                  width: "40px",
                  height: "40px",
                  border: "2px solid #fff",
                  bgcolor: "#000",
                }}
              />
              <Box>
                <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                  {user.username}
                </Typography>
                <Typography sx={{ fontSize: "12px", color: "#A5A5A5" }}>
                  {user.email}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "2em",
                marginTop: "64px",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                onClick={handleEdit}
                sx={{
                  borderRadius: "5px",
                  bgcolor: "var(--bg-data-color)",
                  width: "60%",
                  minWidth: "288px",
                  maxWidth: "388px",
                  padding: "6px",
                }}
              >
                Editar dados de cadastro
              </Button>
              <Button
                variant="contained"
                onClick={handleDelete}
                sx={{
                  borderRadius: "5px",
                  bgcolor: "var(--bg-data-color)",
                  width: "60%",
                  minWidth: "288px",
                  maxWidth: "388px",
                  padding: "6px",
                }}
              >
                Excluir conta
              </Button>
            </Box>
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                position: "absolute",
                bottom: "16px",
                left: "50%",
                transform: "translateX(-50%)",
                borderRadius: "5px",
                bgcolor: "var(--bg-data-color)",
                width: "60%",
                minWidth: "288px",
                maxWidth: "388px",
                padding: "6px",
              }}
            >
              Sair da conta
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

ProfilePage.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default ProfilePage;
