import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5501/accounts";

// Thunks para operações assíncronas
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.get(BASE_URL);
      const foundUser = response.data.find(
        (account) =>
          account.email === email && account.password === password
      );

      if (!foundUser) throw new Error("Credenciais inválidas.");
      
      // Armazena no Redux e localStorage
      localStorage.setItem("userId", foundUser.id); // Persistir no localStorage
      return foundUser;
    } catch (error) {
      const errorMessage = error.message || "Erro desconhecido";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, thunkAPI) => {
    try {
      const response = await axios.get(BASE_URL);
      const existingUser = response.data.find(
        (account) => account.email === email
      );

      if (existingUser) throw new Error("O e-mail já está em uso.");

      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password,
        favorites: [],
        role: "user",
      };

      await axios.post(BASE_URL, newUser);
      localStorage.setItem("userId", newUser.id); // Persistir no localStorage
      return newUser;
    } catch (error) {
      const errorMessage = error.message || "Erro ao registrar usuário";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUser",
  async (_, thunkAPI) => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const response = await axios.get(`${BASE_URL}/${userId}`);
        
        if (!response.data) throw new Error("Usuário não encontrado");

        return response.data; // Retorna usuário ao Redux
      } catch (error) {
        localStorage.removeItem("userId"); // Limpa do localStorage caso erro
        return thunkAPI.rejectWithValue(
          `Erro ao carregar usuário: ${error.message || "Erro desconhecido"}`
        );
      }
    }
    return null; // Se não encontrar o usuário no localStorage
  }
);

// Configuração do slice
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
      localStorage.removeItem("userId"); // Remove do localStorage ao deslogar
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
        state.user = action.payload; // Salva o usuário após login
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
        state.user = action.payload; // Salva o usuário após registro
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
        state.user = action.payload; // Salva o usuário no Redux após carregar do localStorage
      })
      .addCase(loadUserFromStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null; // Caso falhe, o usuário é removido
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
