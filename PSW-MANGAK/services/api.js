import axios from "axios";

const API_URL = "http://localhost:5001";
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const fetchEvaluationById = async (evaluationId) => {
  try {
    validateId(evaluationId, "avaliação");
    const response = await axiosInstance.get(`/evaluations/${evaluationId}`);
    return response.data;
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
    return response.data;
  } catch (error) {
    handleError(error, `Erro ao buscar ${type} com ID ${id}`);
  }
};

const updateById = async (endpoint, id, data, type) => {
  try {
    validateId(id, type);
    const response = await axiosInstance.put(`/${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    handleError(error, `Erro ao atualizar ${type} com ID ${id}`);
  }
};

export const fetchAuthorById = async (authorId) =>
  fetchById("authors", authorId, "autor");

export const fetchMangas = async () => {
  try {
    const response = await axiosInstance.get("/mangas");
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao buscar mangás");
  }
};

export const fetchMangaById = async (id) => fetchById("mangas", id, "mangá");

export const createManga = async (newManga) => {
  try {
    const response = await axiosInstance.post("/mangas", newManga);
    return response.data;
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
    return response.data;
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
    return response.data;
  } catch (error) {
    handleError(error, `Erro ao excluir conta com ID ${id}`);
  }
};

export const fetchFavorites = async (userId) => {
  try {
    validateId(userId, "usuário");
    const account = await fetchAccountById(userId);
    const favorites = account.favorites || [];
    return await Promise.all(favorites.map((mangaId) => fetchMangaById(mangaId)));
  } catch (error) {
    handleError(error, "Erro ao buscar favoritos");
  }
};

export const updateFavorites = async (userId, mangaId, action) => {
  try {
    validateId(userId, "usuário");
    validateId(mangaId, "mangá");

    // Buscar os dados completos do usuário
    const account = await fetchAccountById(userId);

    if (!account || typeof account !== "object") {
      throw new Error("Usuário não encontrado ou dados inválidos");
    }

    // Atualizar a lista de favoritos
    const updatedFavorites =
      action === "add"
        ? [...new Set([...account.favorites, mangaId])] // Adicionar favoritos únicos
        : account.favorites.filter((id) => id !== mangaId); // Remover o favorito

    // Criar um objeto atualizado para preservar todos os dados existentes
    const updatedAccount = {
      ...account, // Preserva todas as propriedades do usuário
      favorites: updatedFavorites, // Atualiza apenas os favoritos
    };

    // Atualizar a conta com os dados mesclados
    return await updateAccount(userId, updatedAccount);
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
      `http://localhost:5001/evaluations?mangaId=${mangaId}`
    );
    if (response.status !== 200 || !response.data) {
      throw new Error("Erro ao buscar avaliações");
    }
    return response.data;
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
    return response.data;
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
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error.message);
    throw error;
  }
};

export const deleteEvaluation = async (evaluationId) => {
  try {
    validateId(evaluationId, "avaliação");
    const response = await axiosInstance.delete(`/evaluations/${evaluationId}`);
    return response.data;
  } catch (error) {
    handleError(error, `Erro ao excluir avaliação com ID ${evaluationId}`);
  }
};
