import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Box, CircularProgress } from "@mui/material";

const BASE_URL = "http://localhost:5001/accounts";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

      setUser(foundUser);
      localStorage.setItem("userId", foundUser.id);
      return foundUser;
    } catch (error) {
      console.error("Erro ao autenticar usuário:", error.message);
      throw new Error("Credenciais inválidas.");
    }
  };

  const register = async ({ username, email, password }) => {
    try {
      const response = await axios.get(BASE_URL);
      const existingUser = response.data.find(
        (account) => account.email === email
      );

      if (existingUser) {
        throw new Error("O e-mail já está em uso.");
      }

      const newUser = {
        username,
        email,
        password,
        id: Date.now().toString(),
        favorites: [],
      };

      await axios.post(BASE_URL, newUser);
      setUser(newUser);
      localStorage.setItem("userId", newUser.id);

      return newUser;
    } catch (error) {
      console.error("Erro ao registrar usuário:", error.message);
      throw new Error("Erro ao registrar. Verifique os dados e tente novamente.");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId");
  };

  useEffect(() => {
    const loadUserFromLocalStorage = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(`${BASE_URL}/${userId}`);
          setUser(response.data);
        } catch (error) {
          console.error("Erro ao carregar usuário do localStorage:", error.message);
          localStorage.removeItem("userId");
        }
      }
      setLoading(false);
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
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext };
