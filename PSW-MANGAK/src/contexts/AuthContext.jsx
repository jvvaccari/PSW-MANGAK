import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Box, CircularProgress } from "@mui/material";

const BASE_URL = "http://localhost:5001/accounts";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Usuário autenticado
  const [loading, setLoading] = useState(true); // Estado de carregamento

  // Função para autenticar o usuário
  const login = async (email, password) => {
    try {
      const response = await axios.get(BASE_URL);
      const foundUser = response.data.find(
        (account) =>
          account.email === email &&
          account.password === password
      );

      if (!foundUser) {
        throw new Error("Credenciais inválidas.");
      }

      setUser(foundUser); // Atualiza o estado do usuário
      localStorage.setItem("userId", foundUser.id); // Salva no localStorage
      return foundUser;
    } catch (error) {
      console.error("Erro ao autenticar usuário:", error.message);
      throw new Error("Credenciais inválidas.");
    }
  };

  // Função para deslogar o usuário
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId"); // Remove o ID do localStorage
  };

  // Carregar o usuário do localStorage ao inicializar
  useEffect(() => {
    const loadUserFromLocalStorage = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(`${BASE_URL}/${userId}`);
          setUser(response.data);
        } catch (error) {
          console.error("Erro ao carregar usuário do localStorage:", error.message);
          localStorage.removeItem("userId"); // Remove o ID inválido
        }
      }
      setLoading(false); // Conclui o carregamento
    };

    loadUserFromLocalStorage();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "var(--bg-page-color)",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext };