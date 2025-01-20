import axios from "axios";

const API_URL = "http://localhost:5501";
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});


const transformResponse = (data) =>
  Array.isArray(data)
    ? data.map((item) => ({ ...item, id: item._id || item.id }))
    : { ...data, id: data._id || data.id };




export const fetchEvaluationById = async (evaluationId) => {
  try {
    validateId(evaluationId, "avaliação");
    const response = await axiosInstance.get(`/evaluations/${evaluationId}`);
    return transformResponse(response.data);
  } catch (error) {
    handleError(error, `Erro ao buscar avaliação com ID ${evaluationId}`);
  }
};

const handleError = (error, customMessage = "Erro inesperado") => {
  const status = error.response?.status || "Sem status";
  const details = error.response?.data || "Sem detalhes";
  console.error(`${customMessage}: [${status}] ${details}`);
  throw new Error(`${customMessage}: ${details}`);
};

const validateId = (id, type = "genérico") => {
  if (!id || typeof id !== "string") {
    throw new Error(`ID inválido para ${type}. Deve ser uma string válida.`);
  }
};

const fetchById = async (endpoint, id, type) => {
  try {
    validateId(id, type);
    const response = await axiosInstance.get(`/${endpoint}/${id}`);
    return transformResponse(response.data);
  } catch (error) {
    handleError(error, `Erro ao buscar ${type} com ID ${id}`);
  }
};

const updateById = async (endpoint, id, data, type) => {
  try {
    validateId(id, type);
    const response = await axiosInstance.put(`/${endpoint}/${id}`, data);
    return transformResponse(response.data);
  } catch (error) {
    handleError(error, `Erro ao atualizar ${type} com ID ${id}`);
  }
};

export const fetchAuthorById = async (authorId) =>
  fetchById("authors", authorId, "autor");

export const fetchMangas = async () => {
  try {
    const response = await axiosInstance.get("/mangas");
    return transformResponse(response.data);
  } catch (error) {
    handleError(error, "Erro ao buscar mangás");
  }
};

export const fetchMangaById = async (id) => fetchById("mangas", id, "mangá");

export const createManga = async (newManga) => {
  try {
    const response = await axiosInstance.post("/mangas", newManga);
    return transformResponse(response.data);
  } catch (error) {
    handleError(error, "Erro ao criar mangá");
  }
};

export const updateManga = async (id, updatedManga) =>
  updateById("mangas", id, updatedManga, "mangá");

export const deleteManga = async (id) => {
  try {
    validateId(id, "mangá");
    const response = await axiosInstance.delete(`/mangas/${id}`);
    return transformResponse(response.data);
  } catch (error) {
    handleError(error, `Erro ao excluir mangá com ID ${id}`);
  }
};

export const fetchAccountById = async (id) =>
  fetchById("accounts", id, "conta");

export const updateAccount = async (id, data) =>
  updateById("accounts", id, data, "conta");

export const deleteAccount = async (id) => {
  try {
    validateId(id, "conta");
    const response = await axiosInstance.delete(`/accounts/${id}`);
    return transformResponse(response.data);
  } catch (error) {
    handleError(error, `Erro ao excluir conta com ID ${id}`);
  }
};

export const fetchFavorites = async (userId) => {
  try {
    validateId(userId, "usuário");
    const account = await fetchAccountById(userId);
    const favorites = account.favorites || [];
    return transformResponse(await Promise.all(favorites.map((mangaId) => fetchMangaById(mangaId))));
  } catch (error) {
    handleError(error, "Erro ao buscar favoritos");
  }
};

export const updateFavorites = async (userId, mangaId, action) => {
  try {
    validateId(userId, "usuário");
    validateId(mangaId, "mangá");

    const account = await fetchAccountById(userId);

    if (!account || typeof account !== "object") {
      throw new Error("Usuário não encontrado ou dados inválidos");
    }

    const updatedFavorites =
      action === "add"
        ? [...new Set([...account.favorites, mangaId])] 
        : account.favorites.filter((id) => id !== mangaId);

    const updatedAccount = {
      ...account,
      favorites: updatedFavorites,
    };

    return transformResponse(await updateAccount(userId, updatedAccount));
  } catch (error) {
    handleError(
      error,
      `Erro ao ${action === "add" ? "adicionar" : "remover"} favorito`
    );
  }
};

export const fetchEvaluations = async (mangaId) => {
  try {
    const response = await axios.get(
      `http://localhost:5501/evaluations?mangaId=${mangaId}`
    );
    if (response.status !== 200 || !response.data) {
      throw new Error("Erro ao buscar avaliações");
    }
    return transformResponse(response.data);
  } catch (error) {
    console.error("Erro no fetchEvaluations:", error.message);
    return [];
  }
};

export const postEvaluation = async (mangaId, evaluationData) => {
  try {
    validateId(mangaId, "mangá");
    const response = await axiosInstance.post(`/evaluations`, {
      ...evaluationData,
      mangaId,
    });
    return transformResponse(response.data);
  } catch (error) {
    handleError(error, "Erro ao postar avaliação");
  }
};

export const updateEvaluation = async (evaluationId, updatedData) => {
  try {
    const response = await axiosInstance.put(
      `/evaluations/${evaluationId}`,
      updatedData
    );
    console.log("Resposta do backend ao atualizar:", response.data);
    return transformResponse(response.data);
  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error.message);
    throw error;
  }
};

export const deleteEvaluation = async (evaluationId) => {
  try {
    validateId(evaluationId, "avaliação");
    const response = await axiosInstance.delete(`/evaluations/${evaluationId}`);
    return transformResponse(response.data); // Ensure consistency
  } catch (error) {
    handleError(error, `Erro ao excluir avaliação com ID ${evaluationId}`);
  }
};

export const fetchAuthors = async () => {
  try {
    const response = await axiosInstance.get("/authors");
    return transformResponse(response.data);
  } catch (error) {
    handleError(error, "Erro ao buscar autores");
  }
};

export const createAuthor = async (newAuthor) => {
  try {
    const response = await axiosInstance.post("/authors", newAuthor);
    return transformResponse(response.data);
  } catch (error) {
    handleError(error, "Erro ao criar autor");
  }
};

export const updateAuthor = async (id, updatedAuthor) => 
  updateById("authors", id, updatedAuthor, "autor");

export const deleteAuthor = async (id) => {
  try {
    validateId(id, "autor");
    const response = await axiosInstance.delete(`/authors/${id}`);
    return transformResponse(response.data);
  } catch (error) {
    handleError(error, `Erro ao excluir autor com ID ${id}`);
  }
};

export const fetchFavoriteLists = async (userId) => {
  try {
    console.log("Buscando listas para o usuário com ID:", userId);
    const response = await axiosInstance.get(`/favoriteLists?userId=${userId}`);
    console.log("Resposta da API:", response.data);
    return transformResponse(response.data);
  } catch (error) {
    handleError(error, "Erro ao buscar listas de favoritos");
  }
};


export const createFavoriteList = async (listData) => {
  try {
    const response = await axiosInstance.post(`/favoriteLists`, listData);
    return transformResponse(response.data);
  } catch (error) {
    handleError(error, "Erro ao criar lista");
  }
};

export const deleteFavoriteList = async (listId) => {
  try {
    const response = await axiosInstance.delete(`/favoriteLists/${listId}`);
    return transformResponse(response.data);
  } catch (error) {
    handleError(error, "Erro ao deletar lista");
  }
};

export const addMangaToList = async (listId, mangaId) => {
  try {
    const list = await fetchFavoriteListById(listId);
    if (!list) throw new Error('Lista não encontrada'); 

    const updatedMangas = list.mangas.includes(mangaId)
      ? list.mangas
      : [...list.mangas, mangaId]; 

    const response = await axiosInstance.put(`/favoriteLists/${listId}`, {
      ...list,
      mangas: updatedMangas,
    });
    return transformResponse(response.data);
  } catch (error) {
    handleError(error, "Erro ao adicionar mangá à lista");
  }
};

export const removeMangaFromFavoriteList = async (listId, mangaId) => {
  try {
    const list = await fetchFavoriteListById(listId);

    const updatedMangas = list.mangas.filter((manga) => manga !== mangaId);

    const response = await axiosInstance.put(`/favoriteLists/${listId}`, {
      ...list,
      mangas: updatedMangas,
    });

    return transformResponse(response.data);
  } catch (error) {
    console.error("Erro ao remover mangá da lista:", error.message);
    throw error;
  }
};


export const fetchFavoriteListById = async (listId) => {
  try {
    const response = await axiosInstance.get(`/favoriteLists/${listId}`);
    return response.data;
  } catch (error) {
    handleError(error, `Erro ao buscar lista de favoritos com ID ${listId}`);
  }
};

export const fetchMangasByIds = async (mangaIds) => {
  try {
    const mangasData = await Promise.all(
      mangaIds.map((id) => fetchMangaById(id))
    );
    return mangasData;
  } catch (error) {
    handleError(error, "Erro ao buscar mangas");
  }
};
