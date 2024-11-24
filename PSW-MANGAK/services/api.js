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
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchFavorites = async (userId) => {
  try {
    const response = await fetch(`http://localhost:5000/accounts/${userId}`);
    const account = await response.json();

    const favoriteMangas = await Promise.all(
      account.favorites.map(async (mangaId) => {
        const mangaResponse = await fetch(`http://localhost:5000/mangas/${mangaId}`);
        return mangaResponse.json();
      })
    );

    return favoriteMangas;
  } catch (err) {
    console.error("Erro ao buscar favoritos:", err);
    throw err;
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