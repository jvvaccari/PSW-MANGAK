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
      navigate("/login"); // Redirecionar após excluir a conta
    } catch (err) {
      console.error("Erro ao excluir conta:", err);
    }
  };

  const handleLogout = () => {
    // Lógica para deslogar o usuário
    navigate("/login");
  };

  if (!user) return <Typography>Carregando...</Typography>;

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
        <Box sx={{display: "flex",
          flexDirection: "row",}}>
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
          <Box>
            <TextField
              label="Nome de Usuário"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: "16px" }}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: "16px" }}
            />
            <TextField
              label="Senha"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: "16px" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ marginRight: "8px" }}
            >
              Salvar
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Cancelar
            </Button>
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
