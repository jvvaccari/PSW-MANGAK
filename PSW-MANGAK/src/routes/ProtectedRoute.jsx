import { useSelector } from "react-redux";
import { useState,useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { CircularProgress, Box } from "@mui/material";
import * as api from "../../services/api";

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  console.log("Meu user:",user);

  useEffect(() => {
    const userId = user._id;
    if (userId) {
      console.log("Buscando dados do usuário para userId:", userId);
      api.fetchAccountById(userId)
        .then((fetchedUser) => {
          setCurrentUser(fetchedUser);
          console.log("Usuário buscado com sucesso:", fetchedUser);
        })
        .catch((error) => {
          console.error("Erro ao buscar os dados do usuário:", error);
        });
    } else {
      console.log("Nenhum userId encontrado no localStorage.");
    }
  }, [user]);

  if (loading) {
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

  if (!user) {
    console.warn("Usuário não autenticado. Redirecionando para /login.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roleRequired && !currentUser) {
    return <CircularProgress />; 
  }

  if (roleRequired && currentUser.role !== roleRequired) {
    console.warn(`Acesso negado. Necessário papel: ${roleRequired}.`);
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roleRequired: PropTypes.string,
};

export default ProtectedRoute;
