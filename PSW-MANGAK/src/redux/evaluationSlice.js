import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../services/api";

// Função para buscar as avaliações por manga
export const fetchEvaluationsThunk = createAsyncThunk(
  "evaluations/fetchEvaluationsById",
  async (mangaId) => {
    try {
      const data = await api.fetchEvaluationById(mangaId);
      return data || []; // Fallback to an empty array if data is undefined/null
    } catch (error) {
      console.error("Error fetching evaluations:", error);
      throw error;
    }
  }
);

// Função para criar avaliação
export const createEvaluationThunk = createAsyncThunk(
  "evaluations/createEvaluation",
  async ({ mangaId, evaluationData, userId }) => {
    console.log("userId:", userId);
    try {
      const data = await api.postEvaluation(mangaId, evaluationData, userId);
      console.log("Created Evaluation:", data);
      return data; // Certifique-se de que o retorno contém os dados necessários
    } catch (error) {
      console.error("Error creating evaluation:", error);
      throw error;
    }
  }
);

// Função para atualizar avaliação
export const updateEvaluationThunk = createAsyncThunk(
  "evaluations/updateEvaluation",
  async ({ evaluationId, evaluationData }) => {
    try {
      console.log("Updating Evaluation:", { evaluationId, evaluationData }); // Debugging
      const data = await api.updateEvaluation(evaluationId, evaluationData);
      console.log("Updated Evaluation Response:", data); // Debugging
      return {
        ...data,
        username: evaluationData.username || data.username,
      };
    } catch (error) {
      console.error("Error updating evaluation:", error);
      throw error;
    }
  }
);

// Função para excluir avaliação
export const deleteEvaluationThunk = createAsyncThunk(
  "evaluations/deleteEvaluation",
  async ({ evaluationId }) => {
    try {
      await api.deleteEvaluation(evaluationId);
      console.log("Deleted Evaluation ID:", evaluationId); // Debugging
      return evaluationId; // Retorna o ID da avaliação excluída
    } catch (error) {
      console.error("Error deleting evaluation:", error);
      throw error;
    }
  }
);

const evaluationSlice = createSlice({
  name: "evaluations",
  initialState: {
    evaluations: [], // Certifique-se de que as avaliações são sempre um array
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvaluationsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvaluationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.evaluations = action.payload || []; // Fallback to an empty array if payload is undefined/null
        state.error = null;
      })
      .addCase(fetchEvaluationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Erro ao carregar avaliações.";
      })
      .addCase(createEvaluationThunk.fulfilled, (state, action) => {
        state.evaluations.push(action.payload);
      })
      .addCase(createEvaluationThunk.rejected, (state, action) => {
        state.error = action.error?.message || "Erro ao criar avaliação.";
      })
      .addCase(updateEvaluationThunk.fulfilled, (state, action) => {
        const index = state.evaluations.findIndex(
          (evaluation) => evaluation._id === action.payload._id // Mudado de `id` para `_id`
        );
        if (index !== -1) {
          state.evaluations[index] = action.payload;
        }
      })
      .addCase(updateEvaluationThunk.rejected, (state, action) => {
        state.error = action.error?.message || "Erro ao atualizar avaliação.";
      })
      .addCase(deleteEvaluationThunk.fulfilled, (state, action) => {
        state.evaluations = state.evaluations.filter(
          (evaluation) => evaluation._id !== action.payload // Mudado de `id` para `_id`
        );
      })
      .addCase(deleteEvaluationThunk.rejected, (state, action) => {
        state.error = action.error?.message || "Erro ao excluir avaliação.";
      });
  },
});

export default evaluationSlice.reducer;
