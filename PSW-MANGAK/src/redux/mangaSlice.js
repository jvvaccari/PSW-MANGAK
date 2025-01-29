// src/redux/mangaSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MangaAPI } from "../../services/api";

// Async thunks
export const loadMangas = createAsyncThunk("manga/loadMangas", async () => {
  const data = await MangaAPI.fetchAll();
  return data || [];
});

export const createMangaThunk = createAsyncThunk(
  "manga/createManga",
  async (newManga) => {
    const data = await MangaAPI.create(newManga);
    return data;
  }
);

export const updateMangaThunk = createAsyncThunk(
  "manga/updateManga",
  async ({ id, mangaData }) => {
    const data = await MangaAPI.update(id, mangaData);
    return { id, ...data };
  }
);

export const deleteMangaThunk = createAsyncThunk(
  "manga/deleteManga",
  async (id) => {
    await MangaAPI.delete(id);
    return id;
  }
);

// Slice
const mangaSlice = createSlice({
  name: "manga",
  initialState: {
    mangas: [],
    loading: false,
    error: null,
    searchTerm: "",
  },
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load mangas
      .addCase(loadMangas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMangas.fulfilled, (state, action) => {
        state.loading = false;
        state.mangas = action.payload;
        state.error = null;
      })
      .addCase(loadMangas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Erro ao carregar mangás.";
      })
      // Create manga
      .addCase(createMangaThunk.fulfilled, (state, action) => {
        state.mangas.push(action.payload);
      })
      .addCase(createMangaThunk.rejected, (state, action) => {
        state.error = action.error?.message || "Erro ao criar mangá.";
      })
      // Update manga
      .addCase(updateMangaThunk.fulfilled, (state, action) => {
        const index = state.mangas.findIndex((manga) => manga.id === action.payload.id);
        if (index !== -1) {
          state.mangas[index] = action.payload;
        }
      })
      .addCase(updateMangaThunk.rejected, (state, action) => {
        state.error = action.error?.message || "Erro ao atualizar mangá.";
      })
      // Delete manga
      .addCase(deleteMangaThunk.fulfilled, (state, action) => {
        state.mangas = state.mangas.filter((manga) => manga.id !== action.payload);
      })
      .addCase(deleteMangaThunk.rejected, (state, action) => {
        state.error = action.error?.message || "Erro ao deletar mangá.";
      });
  },
});

// Export actions and reducer
export const { setSearchTerm } = mangaSlice.actions;
export default mangaSlice.reducer;
