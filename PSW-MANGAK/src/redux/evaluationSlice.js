// src/redux/evaluationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../services/api";

export const fetchEvaluationsThunk = createAsyncThunk(
  "evaluations/fetchEvaluations",
  async (mangaId) => {
    const data = await api.fetchMangaAndEvaluations(mangaId);
    return data || [];
  }
);

export const createEvaluationThunk = createAsyncThunk(
  "evaluations/createEvaluation",
  async ({ mangaId, evaluationData, userId }) => {
    const data = await api.postEvaluation(
      mangaId,
      evaluationData,
      userId
    );
    return data;
  }
);

export const updateEvaluationThunk = createAsyncThunk(
    "evaluations/updateEvaluation",
    async ({ evaluationId, evaluationData }) => {
      console.log("Updating Evaluation:", { evaluationId, evaluationData });
      const data = await api.updateEvaluation(
        evaluationId,
        evaluationData
      );
      console.log("Updated Data Response:", data);
      
      return {
        ...data,
        username: evaluationData.username || data.username,
      };
    }
  );  

export const deleteEvaluationThunk = createAsyncThunk(
  "evaluations/deleteEvaluation",
  async ({ evaluationId, mangaId }) => {
    await api.deleteEvaluation(evaluationId, mangaId);
    return evaluationId;
  }
);

const evaluationSlice = createSlice({
  name: "evaluations",
  initialState: {
    evaluations: [],
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
        state.evaluations = action.payload;
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
          (evaluation) => evaluation.id === action.payload.id
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
          (evaluation) => evaluation.id !== action.payload
        );
      })
      .addCase(deleteEvaluationThunk.rejected, (state, action) => {
        state.error = action.error?.message || "Erro ao excluir avaliação.";
      });
  },
});

export default evaluationSlice.reducer;
