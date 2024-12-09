import axios from "axios";

const API_URL = "http://localhost:5001";
const BASE_URL = `${API_URL}/accounts`;

// Helper para tratar erros de API
const handleError = (error, customMessage) => {
  console.error(customMessage, error.message || error);
  throw new Error(customMessage);
};

// Fetch all mangas
export const fetchMangas = async () => {
  try {
    const response = await axios.get(`${API_URL}/mangas`);
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao buscar mangás.");
  }
};

export const updateManga = async (id, updatedManga) => {
  try {
    const response = await axios.put(`http://localhost:5001/mangas/${id}`, updatedManga);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar o mangá:", error.message);
    throw error;
  }
};

export const updateRating = async (userId, mangaId, rating) => {
  try {
    // Busca o usuário
    const userResponse = await axios.get(`${API_URL}/accounts/${userId}`);
    const user = userResponse.data;

    // Atualiza ou adiciona a avaliação
    const updatedRatings = { ...user.ratings, [mangaId]: rating };
    await axios.put(`${API_URL}/accounts/${userId}`, { ...user, ratings: updatedRatings });

    // Recalcula a média do mangá
    const mangaResponse = await axios.get(`${API_URL}/mangas/${mangaId}`);
    const manga = mangaResponse.data;

    const allRatings = Object.values(updatedRatings).filter((value) => value !== undefined);
    const averageRating =
      allRatings.reduce((sum, value) => sum + value, 0) / allRatings.length;

    await axios.put(`${API_URL}/mangas/${mangaId}`, { ...manga, rating: averageRating });

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error.message);
    throw error;
  }
};

// Fetch a single manga by ID
export const fetchMangaById = async (id) => {
  try {
    if (!id) throw new Error("ID do mangá inválido.");
    const response = await axios.get(`${API_URL}/mangas/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, `Erro ao buscar o mangá com ID ${id}.`);
  }
};

// Fetch user account by ID
export const fetchAccountById = async (id) => {
  try {
    if (!id) throw new Error("ID do usuário inválido.");
    const response = await axios.get(`${BASE_URL}/${id}`);
    if (!response.data) throw new Error("Conta não encontrada.");
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao buscar conta do usuário.");
  }
};

// Fetch user favorites
export const fetchFavorites = async (userId) => {
  try {
    if (!userId) throw new Error("ID do usuário inválido.");
    console.log(`Fetching favorites for userId: ${userId}`);

    const account = await fetchAccountById(userId);
    if (!account || !Array.isArray(account.favorites)) {
      throw new Error("Favoritos não encontrados ou formato incorreto.");
    }

    const favoriteMangas = await Promise.all(
      account.favorites.map(async (mangaId) => {
        try {
          console.log(`Fetching mangaId: ${mangaId}`);
          return await fetchMangaById(mangaId);
        } catch (error) {
          console.warn(`Erro ao buscar mangaId ${mangaId}:`, error.message);
          return null; // Ignora mangas inválidos
        }
      })
    );

    return favoriteMangas.filter(Boolean); // Filtra mangás válidos
  } catch (error) {
    handleError(error, "Erro ao buscar favoritos do usuário.");
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
const updateFavorites = async (userId, mangaId, action) => {
  try {
    if (!mangaId) throw new Error("ID do mangá inválido.");
    const user = await fetchAccountById(userId);

    const updatedFavorites =
      action === "add"
        ? [...new Set([...user.favorites, mangaId.toString()])]
        : user.favorites.filter((id) => id !== mangaId.toString());

    const updatedUser = { ...user, favorites: updatedFavorites };
    return await updateAccount(userId, updatedUser);
  } catch (error) {
    handleError(error, `Erro ao ${action === "add" ? "adicionar" : "remover"} favorito.`);
  }
};

// Update user account
export const updateAccount = async (id, data) => {
  try {
    if (!id) throw new Error("ID do usuário inválido.");
    const response = await axios.put(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao atualizar conta do usuário.");
  }
};

// Delete user account
export const deleteAccount = async (id) => {
  try {
    if (!id) throw new Error("ID do usuário inválido.");
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao excluir conta do usuário.");
  }
};