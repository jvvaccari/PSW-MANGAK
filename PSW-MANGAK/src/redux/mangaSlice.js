// src/redux/mangaSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../services/api";

// Async thunks
export const loadMangas = createAsyncThunk("mangas/loadMangas", async () => {
  const data = await api.fetchMangas();
  return data || [];
});

export const fetchMangaByIdThunk = createAsyncThunk(
  "mangas/fetchMangaById",
  async (id) => {
    const manga = await api.fetchMangaById(id);
    console.log(manga);
    return manga;
  }
);

export const createMangaThunk = createAsyncThunk(
  "mangas/createManga",
  async (newManga) => {
    const data = await api.createManga(newManga);
    return data;
  }
);

export const updateMangaThunk = createAsyncThunk(
  "mangas/updateManga",
  async ({ id, mangaData }) => {
    const data = await api.updateManga(id, mangaData);
    return { id, ...data };
  }
);

export const deleteMangaThunk = createAsyncThunk(
  "mangas/deleteManga",
  async (id) => {
    await api.deleteManga(id);
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
        if (action.payload?.id) {
          const index = state.mangas.findIndex(
            (manga) => manga.id === action.payload.id
          );
          if (index !== -1) {
            state.mangas[index] = action.payload;
          }
        }
      })
      .addCase(updateMangaThunk.rejected, (state, action) => {
        state.error = action.error?.message || "Erro ao atualizar mangá.";
      })
      // Delete manga
      .addCase(deleteMangaThunk.fulfilled, (state, action) => {
        state.mangas = state.mangas.filter(
          (manga) => manga.id !== action.payload
        );
      })
      .addCase(deleteMangaThunk.rejected, (state, action) => {
        state.error = action.error?.message || "Erro ao deletar mangá.";
      })
      // Fetch Manga by ID
      .addCase(fetchMangaByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMangaByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload?.id) {
          const index = state.mangas.findIndex(
            (manga) => manga.id === action.payload.id
          );
          if (index !== -1) {
            state.mangas[index] = action.payload;
          } else {
            state.mangas.push(action.payload);
          }
        }
      })
      .addCase(fetchMangaByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Erro ao buscar o mangá.";
      });
  },
});

// Export actions and reducer
export const { setSearchTerm } = mangaSlice.actions;
export default mangaSlice.reducer;
