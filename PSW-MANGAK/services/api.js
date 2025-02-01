import axios from "axios";

const API_URL = "http://localhost:5502";
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const fetchEvaluations = async () => {
  try {
    const response = await axiosInstance.get(`/evaluations`);
    return response.data;
  } catch (error) {
    handleError(error, `Erro ao buscar avaliações.`);
  }
};

export const fetchEvaluationById = async (mangaId) => {
  try {
    validateId(mangaId, "avaliação");
    const response = await axiosInstance.get(`/evaluations/${mangaId}`);
    return response.data;
  } catch (error) {
    handleError(error, `Erro ao buscar avaliação com ID ${mangaId}`);
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

export const fetchMangaById = async (id) => {
  try {
    const response = await fetch(`http://localhost:5502/mangas/${id}`);

    if (!response.ok) {
      throw new Error('Manga not found');
    }

    const manga = await response.json();
    console.log("Manga fetched:", manga);

    if (manga && manga._id) {
      const filledManga = {
        _id: manga._id, 
        title: manga.title || "Título não disponível", 
        image: manga.image || "URL da imagem não disponível", 
        authorId: manga.authorId || "Autor não disponível", 
        description: manga.description || "Descrição não disponível", 
        yearPubli: manga.yearPubli || "Ano de publicação não disponível", 
        status: manga.status || "Status não disponível", 
        demographic: manga.demographic || "Demografia não disponível", 
        genres: manga.genres || [], 
        artsList: manga.artsList || [], 
        retail: manga.retail || []
      };

      return filledManga;
    } else {
      console.error("Manga ID not found in the response.");
    }
  } catch (error) {
    console.error("Error fetching manga:", error.message);
  }
};

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

export const fetchFavoritesMangas = async (userId) => {
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

    return await updateAccount(userId, updatedAccount);
  } catch (error) {
    handleError(
      error,
      `Erro ao ${action === "add" ? "adicionar" : "remover"} favorito`
    );
  }
};

export const fetchEvaluationsById = async (mangaId) => {
  try {
    const response = await axiosInstance.get(`/evaluations?mangaId=${mangaId}`);
    if (response.status !== 200 || !response.data) {
      throw new Error("Erro ao buscar avaliações");
    }
    return response.data;
  } catch (error) {
    console.error("Erro no fetchEvaluations:", error.message);
    return [];
  }
};

export const fetchMangaAndEvaluations = async (mangaId) => {
  try {
    // Valida o ID do mangá
    validateId(mangaId, "mangá");

    // Busca o mangá com o ID fornecido
    const manga = await fetchMangaById(mangaId);

    if (!manga) {
      throw new Error("Mangá não encontrado");
    }

    // Busca as avaliações do mangá
    const evaluations = await fetchEvaluationsById(mangaId);

    // Associa os dados do usuário (se existirem) às avaliações
    const detailedEvaluations = await Promise.all(
      evaluations.map(async (evaluation) => {
        const user = evaluation.userId
          ? await fetchAccountById(evaluation.userId) 
          : { username: "Usuário desconhecido" };

        // Retorna a avaliação detalhada, incluindo o nome de usuário
        return { ...evaluation, username: user.username };
      })
    );

    // Retorna o mangá com suas avaliações detalhadas
    return { manga, evaluations: detailedEvaluations };

  } catch (error) {
    handleError(error, "Erro ao buscar mangá e avaliações");
    throw error;
  }
};

export const postEvaluation = async (mangaId, evaluationData, userId) => {
  try {
 
    console.log(mangaId);
    console.log(userId);

    const response = await axiosInstance.post(`/evaluations`, {
      ...evaluationData,
      mangaId,
      userId
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

export const fetchAuthors = async () => {
  try {
    const response = await axiosInstance.get("/authors");
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao buscar autores");
  }
};

export const createAuthor = async (newAuthor) => {
  try {
    const response = await axiosInstance.post("/authors", newAuthor);
    return response.data;
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
    return response.data;
  } catch (error) {
    handleError(error, `Erro ao excluir autor com ID ${id}`);
  }
};

export const fetchFavoriteLists = async (userId) => {
  try {
    console.log("Buscando listas para o usuário com ID:", userId);
    const response = await axiosInstance.get(`/favorites?userId=${userId}`);
    console.log("Resposta da API:", response.data);
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao buscar listas de favoritos");
  }
};


export const createFavoriteList = async (listData) => {
  try {
    const response = await axiosInstance.post(`/favorites`, listData);
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao criar lista");
  }
};

export const deleteFavoriteList = async (listId) => {
  try {
    const response = await axiosInstance.delete(`/favorites/${listId}`);
    return response.data; 
  } catch (error) {
    handleError(error, "Erro ao deletar lista");
  }
};

export const addMangaToList = async (listId, mangaId) => {
  try {
    console.log("ListID:",listId);
    console.log("MangaId:",mangaId);

    const list = await fetchFavoriteListById(listId);
    if (!list) throw new Error('Lista não encontrada'); 

    const updatedMangas = list.mangas.includes(mangaId)
      ? list.mangas
      : [...list.mangas, mangaId]; 

    const response = await axiosInstance.put(`/favorites/${listId}`, {
      ...list,
      mangas: updatedMangas,
    });
    return response.data;
  } catch (error) {
    handleError(error, "Erro ao adicionar mangá à lista");
  }
};

export const removeMangaFromFavoriteList = async (listId, mangaId) => {
  try {
    const list = await fetchFavoriteListById(listId);

    const updatedMangas = list.mangas.filter((mangaIdInList) => mangaIdInList !== mangaId);

    console.log("Lista filtrada:", updatedMangas);

    const response = await axiosInstance.put(`/favorites/list/${listId}`, {
      ...list,
      mangas: updatedMangas,  
    });

    return response.data; 
  } catch (error) {
    console.error("Erro ao remover mangá da lista:", error.message);
    throw error;
  }
};

export const fetchFavoriteListById = async (listId) => {
  try {
    const response = await axiosInstance.get(`/favorites/${listId}`);
    return response.data;
  } catch (error) {
    handleError(error, `Erro ao buscar lista de favoritos com ID ${listId}`);
  }
};

export const fetchMangasByListId = async (listId) => {
  try {
    const list = await fetchFavoriteListById(listId);
    const allMangas = await fetchMangas();
    const favoriteMangas =  list.mangas.map((mangaId) => allMangas.find((manga) => manga._id === mangaId));
    return favoriteMangas;
  } catch (error) {
    handleError(error, "Erro ao buscar mangas");
  }
};