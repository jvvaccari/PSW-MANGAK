import useAuth from "../contexts/useAuth";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user } = useAuth(); // Obtém o usuário autenticado do contexto

  // Verifica se o usuário está autenticado
  if (!user) {
    return <Navigate to="/login" replace />; // Redireciona para login com o histórico substituído
  }

  // Verifica se o usuário tem o papel necessário, caso especificado
  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/" replace />; // Redireciona para a página inicial se o papel não for suficiente
  }

  // Renderiza os filhos se as verificações forem bem-sucedidas
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // Conteúdo a ser protegido
  roleRequired: PropTypes.string, // Papel necessário para acessar a rota (opcional)
};

export default ProtectedRoute;