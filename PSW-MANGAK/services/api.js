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

// Criar manga
export const createManga = async (newManga) => {
  try {
    const response = await axios.post(`${API_URL}/mangas`, newManga);
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao criar mangá.");
  }
};

// Atualizar manga
export const updateManga = async (id, updatedManga) => {
  try {
    const response = await axios.put(`${API_URL}/mangas/${id}`, updatedManga);
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao atualizar o mangá.");
  }
};

// Deletar manga
export const deleteManga = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/mangas/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao excluir o mangá.");
  }
};

// Fetch uma manga por ID
export const fetchMangaById = async (id) => {
  try {
    if (!id) throw new Error("ID do mangá inválido.");
    const response = await axios.get(`${API_URL}/mangas/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, `Erro ao buscar o mangá com ID ${id}.`);
  }
};

// Atualizar avaliações
export const updateRating = async (userId, mangaId, rating) => {
  try {
    const userResponse = await axios.get(`${API_URL}/accounts/${userId}`);
    const user = userResponse.data;

    const updatedRatings = { ...user.ratings, [mangaId]: rating };
    await axios.put(`${API_URL}/accounts/${userId}`, { ...user, ratings: updatedRatings });

    const mangaResponse = await axios.get(`${API_URL}/mangas/${mangaId}`);
    const manga = mangaResponse.data;

    const allRatings = Object.values(updatedRatings).filter((value) => value !== undefined);
    const averageRating =
      allRatings.reduce((sum, value) => sum + value, 0) / allRatings.length;

    await axios.put(`${API_URL}/mangas/${mangaId}`, { ...manga, rating: averageRating });

    return { success: true };
  } catch (error) {
    handleError(error, "Erro ao atualizar avaliação.");
  }
};

// Fetch conta do usuário por ID
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

// Fetch favoritos do usuário
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
          handleError(error, "Erro ao favoritar mangá."); // Ignora mangas inválidos
        }
      })
    );

    return favoriteMangas.filter(Boolean); // Filtra mangás válidos
  } catch (error) {
    handleError(error, "Erro ao buscar favoritos do usuário.");
  }
};

// Adicionar manga aos favoritos
export const addFavorite = async (userId, mangaId) => {
  return await updateFavorites(userId, mangaId, "add");
};

// Remover manga dos favoritos
export const removeFavorite = async (userId, mangaId) => {
  return await updateFavorites(userId, mangaId, "remove");
};

// Atualizar favoritos (adicionar/remover)
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

// Atualizar conta do usuário
export const updateAccount = async (id, data) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao atualizar conta do usuário.");
  }
};

// Deletar conta do usuário
export const deleteAccount = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao excluir conta do usuário.");
  }
};

export const fetchComments = async (mangaId) => {
  try {
    if (!mangaId) throw new Error("ID do mangá inválido.");
    const manga = await fetchMangaById(mangaId); // Busca o mangá específico
    return manga.comments || []; // Retorna os comentários ou um array vazio
  } catch (error) {
    handleError(error, "Erro ao buscar comentários.");
  }
};

// Post a new comment
export const postComment = async (mangaId, commentData) => {
  try {
    if (!mangaId) throw new Error("ID do mangá inválido.");
    const manga = await fetchMangaById(mangaId); // Busca o mangá específico
    const newComment = {
      id: `c${Date.now()}`, // Gera um ID único para o comentário
      ...commentData,
    };
    const updatedManga = {
      ...manga,
      comments: [...(manga.comments || []), newComment], // Adiciona o novo comentário
    };
    await axios.put(`${API_URL}/mangas/${mangaId}`, updatedManga); // Atualiza o mangá
    return newComment;
  } catch (error) {
    handleError(error, "Erro ao postar comentário.");
  }
};

// Update comment reactions (like or dislike)
export const updateCommentReaction = async (mangaId, commentId, reactionType) => {
  try {
    const manga = await fetchMangaById(mangaId); // Busca o mangá específico
    const updatedComments = manga.comments.map((comment) => {
      if (comment.id === commentId) {
        const reactions = comment.reactions || { likes: 0, dislikes: 0 };
        if (reactionType === "like") {
          reactions.likes += 1;
        } else if (reactionType === "dislike") {
          reactions.dislikes += 1;
        }
        return { ...comment, reactions }; // Atualiza as reações
      }
      return comment;
    });
    const updatedManga = { ...manga, comments: updatedComments };
    await axios.put(`${API_URL}/mangas/${mangaId}`, updatedManga); // Atualiza o mangá
    return updatedComments.find((comment) => comment.id === commentId);
  } catch (error) {
    handleError(
      error,
      `Erro ao ${reactionType === "like" ? "curtir" : "descurtir"} comentário.`
    );
  }
};

// Fetch replies for a comment
export const fetchReplies = async (mangaId, commentId) => {
  try {
    const manga = await fetchMangaById(mangaId); // Busca o mangá específico
    const comment = manga.comments.find((c) => c.id === commentId);
    return comment?.replies || []; // Retorna as respostas ou um array vazio
  } catch (error) {
    handleError(error, "Erro ao buscar respostas.");
  }
};

// Post a reply to a comment
export const postReply = async (mangaId, commentId, replyData) => {
  try {
    const manga = await fetchMangaById(mangaId); // Busca o mangá específico
    const updatedComments = manga.comments.map((comment) => {
      if (comment.id === commentId) {
        const newReply = {
          id: `r${Date.now()}`, // Gera um ID único para a resposta
          ...replyData,
        };
        const replies = comment.replies || [];
        return { ...comment, replies: [...replies, newReply] }; // Adiciona a nova resposta
      }
      return comment;
    });
    const updatedManga = { ...manga, comments: updatedComments };
    await axios.put(`${API_URL}/mangas/${mangaId}`, updatedManga); // Atualiza o mangá
    return updatedComments.find((comment) => comment.id === commentId).replies.at(-1); // Retorna a última resposta
  } catch (error) {
    handleError(error, "Erro ao postar resposta.");
  }
};