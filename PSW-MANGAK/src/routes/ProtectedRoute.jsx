// routes/ProtectedRoute.jsx (Refactored)
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, loading } = useSelector((state) => state.auth);

  // If auth is still loading from localStorage, you can return a spinner if desired
  if (loading) {
    return <div>Carregando...</div>;
  }

  // If not logged in, redirect
  if (!user) {
    console.warn("Usuário não autenticado. Redirecionando para /login.");
    return <Navigate to="/login" replace />;
  }

  // If route requires a certain role, check
  if (roleRequired && user.role !== roleRequired) {
    console.warn(`Acesso negado. Necessário papel: ${roleRequired}.`);
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the protected content
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roleRequired: PropTypes.string,
};

export default ProtectedRoute;
