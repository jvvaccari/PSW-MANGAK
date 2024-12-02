import axios from "axios";

const API_URL = "http://localhost:5001";
const BASE_URL = "http://localhost:5001/accounts";

// Fetch all mangas
export const fetchMangas = async () => {
  try {
    const response = await axios.get(`${API_URL}/mangas`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar mangás:", error);
    throw error;
  }
};

// Fetch a single manga by ID
export const fetchMangaById = async (id) => {
  try {
    if (!id) {
      throw new Error('ID inválido');
    }
    const response = await axios.get(`${API_URL}/mangas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar o mangá com ID ${id}:`, error);
    throw error;
  }
};

// Fetch user account by ID
export const fetchAccountById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    if (!response.data) {
      throw new Error("Conta não encontrada");
    }
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar conta do usuário:", error);
    throw new Error("Erro ao buscar conta do usuário");
  }
};

// Fetch user's favorite mangas
export const fetchFavorites = async (userId) => {
  try {
    if (!userId) {
      throw new Error('ID do usuário inválido');
    }

    const response = await axios.get(`${BASE_URL}/${userId}`);
    const account = response.data;

    if (!account || !Array.isArray(account.favorites)) {
      throw new Error("Favoritos não encontrados");
    }

    const favoriteMangas = await Promise.all(
      account.favorites.map(async (mangaId) => {
        if (typeof mangaId !== 'string' && typeof mangaId !== 'number') {
          console.warn(`ID de manga inválido: ${mangaId}`);
          return null;  // Ignora IDs inválidos
        }         
        const mangaResponse = await axios.get(`${API_URL}/mangas/${mangaId}`);
        return mangaResponse.data;
      })
    );

    return favoriteMangas.filter(manga => manga !== null);
  } catch (err) {
    console.error("Erro ao buscar favoritos:", err);
    throw new Error("Erro ao buscar seus favoritos");
  }
};

// Add manga to user's favorites
export const addFavorite = async (userId, mangaId) => {
  return await updateFavorites(userId, mangaId, "add");
};

// Remove manga from user's favorites
export const removeFavorite = async (userId, mangaId) => {
  return await updateFavorites(userId, mangaId, "remove");
};

// Update favorites (add/remove)
export const updateFavorites = async (userId, mangaId, action) => {
  try {
    if (!mangaId) {
      throw new Error('ID do manga inválido');
    }

    // Garantir que mangaId seja tratado corretamente como string ou número
    const userResponse = await axios.get(`${BASE_URL}/${userId}`);
    const user = userResponse.data;

    if (!user.favorites) {
      user.favorites = [];
    }

    if (action === "add" && !user.favorites.includes(mangaId.toString())) {
      user.favorites.push(mangaId.toString());
    }

    if (action === "remove") {
      user.favorites = user.favorites.filter(id => id !== mangaId.toString());
    }

    user.favorites = Array.from(new Set(user.favorites)); // Ensure unique favorites

    const updatedUser = await updateAccount(userId, user);
    return updatedUser;
  } catch (err) {
    console.error("Erro ao atualizar os favoritos:", err);
    throw err;
  }
};

// Update user account
export const updateAccount = async (id, data) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar conta:", error);
    throw error;
  }
};

// Delete user account
export const deleteAccount = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar conta:", error);
    throw error;
  }
};
