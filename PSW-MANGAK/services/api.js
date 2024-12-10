import axios from "axios";

const API_URL = "http://localhost:5001";
const BASE_URL = `${API_URL}/accounts`;

const handleError = (error, customMessage) => {
  console.error(customMessage, error.message || error);
  throw new Error(customMessage);
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export const fetchMangas = async () => {
  try {
    const response = await axiosInstance.get("/mangas");
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao buscar mangás.");
  }
};

export const createManga = async (newManga) => {
  try {
    const response = await axiosInstance.post("/mangas", newManga);
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao criar mangá.");
  }
};

export const updateManga = async (id, updatedManga) => {
  try {
    const response = await axiosInstance.put(`/mangas/${id}`, updatedManga);
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao atualizar o mangá.");
  }
};

export const deleteManga = async (id) => {
  try {
    const response = await axiosInstance.delete(`/mangas/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao excluir o mangá.");
  }
};

export const fetchMangaById = async (id) => {
  try {
    if (!id) throw new Error("ID do mangá inválido.");
    const response = await axiosInstance.get(`/mangas/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, `Erro ao buscar o mangá com ID ${id}.`);
  }
};

export const updateRating = async (userId, mangaId, rating) => {
  try {
    const userResponse = await axiosInstance.get(`/accounts/${userId}`);
    const user = userResponse.data;

    const updatedRatings = { ...user.ratings, [mangaId]: rating };
    await axiosInstance.put(`/accounts/${userId}`, { ...user, ratings: updatedRatings });

    const mangaResponse = await axiosInstance.get(`/mangas/${mangaId}`);
    const manga = mangaResponse.data;

    const allRatings = Object.values(updatedRatings).filter((value) => value !== undefined);
    const averageRating =
      allRatings.reduce((sum, value) => sum + value, 0) / allRatings.length;

    await axiosInstance.put(`/mangas/${mangaId}`, { ...manga, rating: averageRating });

    return { success: true };
  } catch (error) {
    handleError(error, "Erro ao atualizar avaliação.");
  }
};

export const fetchAccountById = async (id) => {
  try {
    if (!id) throw new Error("ID do usuário inválido.");
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    if (!response.data) throw new Error("Conta não encontrada.");
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao buscar conta do usuário.");
  }
};

export const fetchFavorites = async (userId) => {
  try {
    if (!userId) throw new Error("ID do usuário inválido.");
    const account = await fetchAccountById(userId);
    if (!account || !Array.isArray(account.favorites)) {
      throw new Error("Favoritos não encontrados ou formato incorreto.");
    }

    const favoriteMangas = await Promise.all(
      account.favorites.map(async (mangaId) => {
        try {
          return await fetchMangaById(mangaId);
        } catch (error) {
          handleError(error, "Erro ao favoritar mangá.");
        }
      })
    );

    return favoriteMangas.filter(Boolean);
  } catch (error) {
    handleError(error, "Erro ao buscar favoritos do usuário.");
  }
};

export const addFavorite = async (userId, mangaId) => {
  return await updateFavorites(userId, mangaId, "add");
};

export const removeFavorite = async (userId, mangaId) => {
  return await updateFavorites(userId, mangaId, "remove");
};

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

export const updateAccount = async (id, data) => {
  try {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao atualizar conta do usuário.");
  }
};

export const deleteAccount = async (id) => {
  try {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao excluir conta do usuário.");
  }
};

export const fetchComments = async (mangaId) => {
  try {
    if (!mangaId) throw new Error("ID do mangá inválido.");
    const manga = await fetchMangaById(mangaId);
    return manga.comments || [];
  } catch (error) {
    handleError(error, "Erro ao buscar comentários.");
  }
};

export const postComment = async (mangaId, commentData) => {
  try {
    if (!mangaId) throw new Error("ID do mangá inválido.");
    const manga = await fetchMangaById(mangaId);
    const newComment = {
      id: `c${Date.now()}`,
      ...commentData,
      reactions: { likes: 0, dislikes: 0 }, // Inicializa com 0 reações
    };
    const updatedManga = {
      ...manga,
      comments: [...(manga.comments || []), newComment],
    };
    await axiosInstance.put(`/mangas/${mangaId}`, updatedManga);
    return newComment;
  } catch (error) {
    handleError(error, "Erro ao postar comentário.");
  }
};

export const updateCommentReaction = async (mangaId, commentId, reactionType) => {
  try {
    const manga = await fetchMangaById(mangaId);
    const updatedComments = manga.comments.map((comment) => {
      if (comment.id === commentId) {
        const reactions = comment.reactions || { likes: 0, dislikes: 0 };
        
        // Verifica se o usuário já reagiu, e atualiza a reação
        if (reactionType === "like") {
          reactions.likes += 1;
        } else if (reactionType === "dislike") {
          reactions.dislikes += 1;
        }
        return { ...comment, reactions };
      }
      return comment;
    });
    const updatedManga = { ...manga, comments: updatedComments };
    await axiosInstance.put(`/mangas/${mangaId}`, updatedManga);
    return updatedComments.find((comment) => comment.id === commentId);
  } catch (error) {
    handleError(error, `Erro ao ${reactionType === "like" ? "curtir" : "descurtir"} comentário.`);
  }
};

export const updateComment = async (mangaId, commentId, newText) => {
  try {
    if (!mangaId || !commentId) throw new Error("ID do mangá ou comentário inválido.");
    const manga = await fetchMangaById(mangaId);
    const updatedComments = manga.comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, text: newText };
      }
      return comment;
    });
    const updatedManga = { ...manga, comments: updatedComments };
    await axiosInstance.put(`/mangas/${mangaId}`, updatedManga);
    return updatedComments.find((comment) => comment.id === commentId);
  } catch (error) {
    handleError(error, "Erro ao atualizar comentário.");
  }
};

export const deleteComment = async (mangaId, commentId) => {
  try {
    if (!mangaId || !commentId) throw new Error("ID do mangá ou comentário inválido.");
    const manga = await fetchMangaById(mangaId);
    const updatedComments = manga.comments.filter((comment) => comment.id !== commentId);
    const updatedManga = { ...manga, comments: updatedComments };
    await axiosInstance.put(`/mangas/${mangaId}`, updatedManga);
    return updatedComments;
  } catch (error) {
    handleError(error, "Erro ao deletar comentário.");
  }
};
