import axios from "axios";

const API_URL = "http://localhost:5502";
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

const transformResponse = (data) =>
  Array.isArray(data)
    ? data.map(({ _id, id, ...rest }) => ({ id: _id || id, ...rest }))
    : { id: data._id || data.id, ...data };

const handleError = (error, message = "Erro inesperado") => {
  const errorMessage = error.response?.data || error.message || message;
  console.error(`${message}:`, errorMessage);
  throw new Error(`${message}: ${errorMessage}`);
};

const validateId = (id, type = "genérico") => {
  if (!id || typeof id !== "string") {
    throw new Error(`ID: ${id} inválido para ${type}. Deve ser uma string válida.`);
  }
};

const apiRequest = async (method, endpoint, data = null, type = "") => {
  try {
    if (method !== "get" && data?.id) validateId(data.id, type);
    const response = await axiosInstance({ method, url: endpoint, data });
    return transformResponse(response.data);
  } catch (error) {
    handleError(
      error,
      `Erro ao ${method === "get" ? "buscar" : method === "post" ? "criar" : method === "put" ? "atualizar" : "excluir"} ${type}`
    );
  }
};

const createApiMethods = (resource, type) => ({
  fetchById: (id) => apiRequest("get", `/${resource}/${id}`, null, type),
  fetchAll: () => apiRequest("get", `/${resource}`, null, type),
  create: (data) => apiRequest("post", `/${resource}`, data, type),
  update: (id, data) => apiRequest("put", `/${resource}/${id}`, data, type),
  delete: (id) => apiRequest("delete", `/${resource}/${id}`, null, type),
});

export const MangaAPI = createApiMethods("mangas", "mangá");
export const AuthorAPI = createApiMethods("authors", "autor");
export const AccountAPI = createApiMethods("accounts", "conta");
export const EvaluationAPI = createApiMethods("evaluations", "avaliação");
export const FavoriteListAPI = createApiMethods("favoriteLists", "lista de favoritos");

export const fetchEvaluations = (mangaId) =>
  apiRequest(
    "get",
    `/evaluations?mangaId=${mangaId}`,
    null,
    "avaliações"
  );

export const fetchMangasByIds = async (ids) =>
  Promise.all(ids.map(MangaAPI.fetchById));

export const updateFavorites = async (userId, mangaId, action) => {
  try {
    validateId(userId, "usuário");
    validateId(mangaId, "mangá");
    const account = await AccountAPI.fetchById(userId);
    const favorites =
      action === "add"
        ? [...new Set([...account.favorites, mangaId])]
        : account.favorites.filter((id) => id !== mangaId);
    return AccountAPI.update(userId, { ...account, favorites });
  } catch (error) {
    handleError(error, `Erro ao ${action === "add" ? "adicionar" : "remover"} favorito`);
  }
};

export const modifyMangaInFavoriteList = async (listId, mangaId, action) => {
  try {
    const list = await FavoriteListAPI.fetchById(listId);
    const mangas =
      action === "add"
        ? [...new Set([...list.mangas, mangaId])]
        : list.mangas.filter((id) => id !== mangaId);
    return FavoriteListAPI.update(listId, { ...list, mangas });
  } catch (error) {
    handleError(error, `Erro ao ${action === "add" ? "adicionar" : "remover"} mangá da lista`);
  }
};

AccountAPI.login = async (credentials) => {
  try {
    const response = await axiosInstance.post("/accounts/login", credentials);
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao fazer login");
  }
};

EvaluationAPI.fetchMangaAndEvaluations = async (mangaId) => {
  try {
    validateId(mangaId, "mangá");

    const evaluations = await EvaluationAPI.fetchAll();

    const mangaEvaluations = evaluations.filter(
      (evaluation) => evaluation.mangaId === mangaId
    );

    const detailedEvaluations = await Promise.all(
      mangaEvaluations.map(async (evaluation) => {
        const user = evaluation.userId
          ? await AccountAPI.fetchById(evaluation.userId)
          : { username: "Usuário desconhecido" };
        return { ...evaluation, username: user.username };
      })
    );

    return detailedEvaluations;
  } catch (error) {
    handleError(error, "Erro ao buscar mangá e avaliações");
  }
};

EvaluationAPI.createEvaluation = async (mangaId, evaluationData, userId) => {
  try {
    console.log(mangaId);
    console.log(userId); 

    validateId(mangaId, "mangá");
    validateId(userId, "usuário");

    const data = {
      mangaId,
      userId,
      ...evaluationData, 
    };

    const response = await apiRequest("post", "/evaluations", data, "avaliação");
    return response;
  } catch (error) {
    handleError(error, "Erro ao criar avaliação");
  }
};

EvaluationAPI.updateEvaluation = async (evaluationId, evaluationData) => {
  try {
    validateId(evaluationId, "avaliação");
    const evaluation = await EvaluationAPI.fetchById(evaluationId);
    if (!evaluation) throw new Error("Avaliação não encontrada");
    const updatedEvaluation = { ...evaluation, ...evaluationData };
    return apiRequest("put", `/evaluations/${evaluationId}`, updatedEvaluation, "avaliação");
  } catch (error) {
    handleError(error, "Erro ao atualizar avaliação");
  }
};

EvaluationAPI.deleteEvaluation = async (evaluationId) => {
  try {
    validateId(evaluationId, "avaliação");
    return apiRequest("delete", `/evaluations/${evaluationId}`, null, "avaliação");
  } catch (error) {
    handleError(error, "Erro ao excluir avaliação");
  }
};

AccountAPI.register = async (userData) => {
  try {
    const { username, email, password } = userData;
    if (!username || !email || !password) {
      throw new Error("Dados de usuário incompletos para registro");
    }
    const data = { username, email, password, favorites: [], lists: [] };
    return AccountAPI.create(data);
  } catch (error) {
    handleError(error, "Erro ao registrar usuário");
  }
};
