import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://localhost:5502/accounts";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });
      const foundUser = response.data;

      if (!foundUser) {
        throw new Error("Credenciais inválidas.");
      }

      const userWithId = { ...foundUser, id: foundUser._id };
      localStorage.setItem("userId", userWithId.id);

      return userWithId;

    } catch (error) {
      const errorMessage =
        error.response?.data || error.message || "Erro desconhecido";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, {
        username,
        email,
        password,
      });
      const newUser = response.data;

      if (!newUser) {
        throw new Error("Erro ao criar usuário.");
      }

      const userWithId = { ...newUser, id: newUser._id };
      localStorage.setItem("userId", userWithId.id);

      return userWithId;
    } catch (error) {
      const errorMessage =
        error.response?.data || error.message || "Erro ao registrar usuário";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUser",
  async (_, thunkAPI) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return null;

    try {
      const response = await axios.get(`${BASE_URL}/${userId}`);
      if (!response.data) {
        throw new Error("Usuário não encontrado");
      }
      const userWithId = { ...response.data, id: response.data._id };
      return userWithId; 
    } catch (error) {
      localStorage.removeItem("userId");
      return thunkAPI.rejectWithValue(
        `Erro ao carregar usuário: ${error.response?.data || error.message || "Erro desconhecido"}`
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,      
    loading: false,  
    error: null,     
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("userId");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loadUserFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; 
      })
      .addCase(loadUserFromStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null; 
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
