import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://localhost:5502/accounts",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("authToken");
    console.log("Token a ser enviado:", authToken);

    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    } else {
      console.warn("Token não encontrado no localStorage");
    }

    return config;
  },
  (error) => {
    console.error("Erro no interceptor de requisição:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;