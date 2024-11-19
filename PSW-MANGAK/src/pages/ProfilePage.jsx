import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, TextField, Avatar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Ícone do botão X
import {
  fetchAccountById,
  updateAccount,
  deleteAccount,
} from "../../services/api";
import PropTypes from "prop-types";

const inputStyles = {
  bgcolor: "var(--bg-data-color)",
  borderRadius: "5px",
  marginBottom: "16px",
  "& .MuiFilledInput-root": {
    color: "#fff",
    "&:before": { borderBottom: "none" },
    "&:after": { borderBottom: "2px solid #fff" },
    "&:hover:not(.Mui-disabled):before": {
      borderBottom: "2px solid #fff",
    },
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
  const navigate = useNavigate(); // Para navegar entre páginas
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log("Carregando usuário com ID:", id);
        const data = await fetchAccountById(id);

        if (data) {
          setUser(data);
          setFormData(data);
        } else {
          console.error("Usuário não encontrado para o ID:", id);
        }
      } catch (err) {
        console.error("Erro ao carregar os dados do usuário:", err);
      }
    };

    loadUser();
  }, [id]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateAccount(id, formData);
      setUser(formData);
      setIsEditing(false);
      console.log("Conta atualizada com sucesso:", formData);
    } catch (err) {
      console.error("Erro ao atualizar conta:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccount(id);
      console.log("Conta excluída com sucesso para o ID:", id);
      navigate("/"); // Redireciona para a página inicial após excluir
    } catch (err) {
      console.error("Erro ao excluir conta:", err);
    }
  };

  const handleLogout = () => {
    navigate("/login"); // Redireciona para a tela de login
    console.log("Usuário desconectado.");
  };

  if (!user) {
    return (
      <Typography sx={{ color: "#fff", textAlign: "center" }}>
        Carregando informações do usuário...
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
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "8px",
            right: "8px",
          }}
        >
          <IconButton
            onClick={() => navigate(-1)} // Volta para a página anterior
            aria-label="Fechar"
            sx={{
              color: "#fff",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography
          variant="h5"
          sx={{
            marginBottom: "2em",
            textAlign: "center",
          }}
        >
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
              fullWidth
              sx={inputStyles}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "32px",
              }}
            >
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  marginRight: "8px",
                  bgcolor: "var(--btn-mangak-color)",
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
          </Box>
        )}
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
    </Box>
  );
}

ProfilePage.propTypes = {
  userId: PropTypes.string,
};

export default ProfilePage;
