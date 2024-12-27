import useAuth from "../contexts/useAuth";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, isLoading } = useAuth(); // Certifique-se de que `useAuth` fornece `isLoading`

  // Exibir um indicador de carregamento enquanto a autenticação está sendo verificada
  if (isLoading) {
    return <div>Carregando...</div>; // Pode ser substituído por um spinner ou componente de loading
  }

  // Redirecionar para login se o usuário não estiver autenticado
  if (!user) {
    console.warn("Usuário não autenticado. Redirecionando para /login.");
    return <Navigate to="/login" replace />;
  }

  // Verificar se o usuário tem a permissão necessária
  if (roleRequired && user.role !== roleRequired) {
    console.warn(`Acesso negado. Necessário papel: ${roleRequired}.`);
    return <Navigate to="/" replace />;
  }

  // Renderizar os filhos se todas as condições forem atendidas
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roleRequired: PropTypes.string,
};

export default ProtectedRoute;
