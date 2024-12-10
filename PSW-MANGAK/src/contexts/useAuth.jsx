import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    console.error("useAuth foi usado fora de um AuthProvider.");
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
};

export default useAuth;