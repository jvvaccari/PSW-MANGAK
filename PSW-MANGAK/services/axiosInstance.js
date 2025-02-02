import axios from 'axios';

// Criação de uma instância do axios com a URL base configurada
const axiosInstance = axios.create({
  baseURL: "https://localhost:5502/accounts", // Certifique-se de que a URL está correta para o seu backend
});

// Interceptor para adicionar o token no cabeçalho 'Authorization' em todas as requisições
axiosInstance.interceptors.request.use(
  (config) => {
    // Obtém o token do localStorage
    const token = localStorage.getItem("authToken");
    
    if (token) {
      // Se o token existir, ele é adicionado ao cabeçalho Authorization da requisição
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn("Token não encontrado no localStorage");
    }
    
    return config;  // Retorna a configuração da requisição
  },
  (error) => {
    // Se ocorrer algum erro, ele é retornado
    return Promise.reject(error);
  }
);

// Exporte a instância para ser utilizada nas requisições
export default axiosInstance;
