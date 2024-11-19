import axios from "axios";

const API_URL = "http://localhost:5000";
const BASE_URL = "http://localhost:5000/accounts";

export const fetchMangas = async () => {
  try {
    const response = await axios.get(`${API_URL}/mangas`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar mangás:", error);
  }
};


export const fetchMangaById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/mangas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar o mangá com ID ${id}:`, error);
  }
};

export const fetchAccountById = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/accounts/${id}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar os dados do usuário");
    }
    return await response.json(); // Certifique-se de que o ID correto é usado na URL
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateAccount = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteAccount = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};