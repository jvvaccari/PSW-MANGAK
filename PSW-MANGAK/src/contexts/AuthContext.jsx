import { createContext, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const BASE_URL = "http://localhost:5001/accounts";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Armazena o usuário logado

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
      return foundUser;
    } catch (error) {
      console.error("Erro ao autenticar usuário:", error.message);
      throw new Error("Credenciais inválidas.");
    }
  };  

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId");
  };

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