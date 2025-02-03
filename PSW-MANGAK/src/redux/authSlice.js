import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/login", { email, password });
      const foundUser = response.data;

      if (!foundUser) {
        throw new Error("Credenciais inválidas.");
      }

      const userWithToken = {
        ...foundUser,
        id: foundUser._id,
        token: foundUser.accessToken,
      };

      console.log("userWithToken:", userWithToken);

      localStorage.setItem("userId", userWithToken.id);
      localStorage.setItem("authToken", userWithToken.accessToken);

      axiosInstance.defaults.headers["Authorization"] = `Bearer ${userWithToken.token}`;

      return userWithToken;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message || "Erro desconhecido");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, thunkAPI ) => {
    try {
      console.log("Iniciando o registro do usuário...");

      const response = await axiosInstance.post("/register", { username, email, password });

      if (!response) {
        throw new Error("Erro ao criar usuário.");
      }

      console.log("Usuário registrado:", response.data);

      const userWithToken = {
        ...response.data.user, 
        id: response.data.user._id, 
        token: response.data.accessToken,
      };

      localStorage.setItem("userId", userWithToken.id);
      localStorage.setItem("authToken", userWithToken.token);

      axiosInstance.defaults.headers["Authorization"] = `Bearer ${userWithToken.token}`;

      return userWithToken;

    } catch (error) {
      console.error("Erro no processo de registro:", error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message || "Erro ao registrar usuário");
    }
  }
);

export const getUserById = createAsyncThunk(
  "auth/getUserById",
  async (userId, thunkAPI) => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) throw new Error("Token de autenticação não encontrado.");

      const response = await axiosInstance.get(`/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message || "Erro ao buscar usuário.");
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ userId, userData }, thunkAPI) => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) throw new Error("Token de autenticação não encontrado.");

      const response = await axiosInstance.put(`/${userId}`, userData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message || "Erro ao atualizar usuário.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem("userId", action.payload.user._id);
      localStorage.setItem("authToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("userId");
      localStorage.removeItem("authToken");
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
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
