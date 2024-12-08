import useAuth from "../contexts/useAuth";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user } = useAuth(); // Obtém o usuário logado do contexto

  // Verifica se o usuário está logado
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Verifica se o usuário tem o papel necessário (se for especificado)
  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/" />; // Redireciona para a página inicial se o papel não for suficiente
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roleRequired: PropTypes.string, // Papel necessário (opcional)
};

export default ProtectedRoute;