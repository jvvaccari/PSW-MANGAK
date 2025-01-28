// mangaSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MangaAPI } from "../../services/api";

export const loadMangas = createAsyncThunk("manga/loadMangas", async () => {
  const data = await MangaAPI.fetchAll();
  return data || [];
});

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
      });
  },
});

export const { setSearchTerm } = mangaSlice.actions;
export default mangaSlice.reducer;
