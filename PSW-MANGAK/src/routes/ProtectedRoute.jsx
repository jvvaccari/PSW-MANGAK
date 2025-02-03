import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { CircularProgress, Box } from "@mui/material";
import * as api from "../../services/api";

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, loading } = useSelector((state) => state.auth);
  console.log("Estado do usuário do Redux:", user); // Log para verificar se o user está vindo corretamente do Redux

  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // Controle do carregamento do usuário
  const location = useLocation();

  useEffect(() => {
    console.log("Efeito useEffect executado. user:", user); // Log do user após navegação ou renderização

    const userId = user ? user._id : localStorage.getItem("userId");
    
    if (userId) {
      console.log("Iniciando a busca dos dados do usuário...");
      api
        .fetchAccountById(userId)
        .then((fetchedUser) => {
          console.log("Dados do usuário recebidos:", fetchedUser);
          setCurrentUser(fetchedUser);
          setLoadingUser(false);
        })
        .catch((error) => {
          setLoadingUser(false);
          console.error("Erro ao buscar dados do usuário:", error);
        });
    } else {
      setLoadingUser(false);
      console.log("Nenhum userId encontrado no localStorage ou no Redux.");
    }
  }, [user]);

  console.log("userId no localStorage:", localStorage.getItem("userId"));
  console.log("authToken no localStorage:", localStorage.getItem("authToken"));

  // Exibição de carregamento principal
  if (loading || loadingUser) {
    console.log("Carregando dados do usuário ou autenticação..."); // Log de carregamento
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Verificação de autenticação
  if (!user) {
    console.warn("Usuário não autenticado. Redirecionando para /login."); // Log de erro de autenticação
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificação de papel necessário
  if (roleRequired && !currentUser) {
    console.log("Dados do usuário ainda não carregados. Aguardando..."); // Log para aguardar dados
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (roleRequired && currentUser.role !== roleRequired) {
    console.warn(`Acesso negado. Necessário papel: ${roleRequired}.`); // Log quando o papel não corresponde
    return <Navigate to="/" replace />;
  }

  console.log("Usuário autenticado e com papel adequado. Renderizando a rota protegida."); // Log para confirmar que o usuário passou na validação
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roleRequired: PropTypes.string,
};

export default ProtectedRoute;
