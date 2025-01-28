// routes/ProtectedRoute.jsx (Refactored)
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, loading } = useSelector((state) => state.auth);

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
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && user.role !== roleRequired) {
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
