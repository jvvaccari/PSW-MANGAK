import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const BASE_URL = "http://localhost:5001/accounts";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Armazena o usuário logado

  // Função para autenticar o usuário
  const login = async (email, password) => {
    try {
      console.log("Iniciando requisição para o banco de dados...");
      const response = await axios.get(BASE_URL);
      console.log("Resposta da API:", response.data);

      const foundUser = response.data.find(
        (account) =>
          account.email === email &&
          account.password === password
      );

      if (!foundUser) {
        throw new Error("Credenciais inválidas.");
      }

      console.log("Usuário encontrado:", foundUser);
      setUser(foundUser); // Atualiza o estado do usuário
      localStorage.setItem("userId", foundUser.id); // Salva o ID do usuário no localStorage
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
    };

    loadUserFromLocalStorage();
  }, []);

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