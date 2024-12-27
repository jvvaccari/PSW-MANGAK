import useAuth from "../contexts/useAuth";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, isLoading } = useAuth(); 


  if (isLoading) {
    return <div>Carregando...</div>; 
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
