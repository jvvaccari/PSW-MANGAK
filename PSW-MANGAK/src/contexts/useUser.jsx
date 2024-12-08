import { useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import axios from "axios";

const useAuth = () => {
  const { user, setUser } = useContext(UserContext);

  // Função de login
  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error("Por favor, preencha todos os campos.");
      }

      const response = await axios.post("http://localhost:5001/login", { email, password });
      const userData = response.data;

      if (!userData || !userData.role) {
        throw new Error("Usuário ou senha inválidos.");
      }

      setUser(userData); // Salva os dados do usuário no contexto
      localStorage.setItem("user", JSON.stringify(userData)); // Salva no localStorage para persistência
    } catch (error) {
      console.error("Erro ao autenticar:", error.message);
      throw error; // Propaga o erro para ser tratado no componente
    }
  };

  // Função de logout
  const logout = () => {
    setUser(null); // Limpa os dados do usuário no contexto
    localStorage.removeItem("user"); // Remove os dados persistidos
  };

  // Recuperar o usuário do localStorage ao carregar o app
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Atualiza o estado com os dados salvos
    }
  }, [setUser]);

  return { user, login, logout };
};

export default useAuth;