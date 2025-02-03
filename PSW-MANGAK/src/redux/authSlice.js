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

      console.log("userWithToken:",userWithToken);

      localStorage.setItem("userId", userWithToken.id);
      localStorage.setItem("authToken", userWithToken.accessToken);

      axiosInstance.defaults.headers["Authorization"] = `Bearer ${userWithToken.accessToken}`;

      return userWithToken;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message || "Erro desconhecido");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/register", { username, email, password });
      const { accessToken, refreshToken, user } = response.data;

      if (!user || !accessToken) {
        throw new Error("Erro ao criar usuário.");
      }

      localStorage.setItem("userId", user._id);
      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return { user, accessToken, refreshToken };
    } catch (error) {
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

// export const loadUserFromStorage = createAsyncThunk(
//   "auth/loadUser",
//   async (_, thunkAPI) => {
//     const userId = localStorage.getItem("userId");
//     const authToken = localStorage.getItem("authToken");

//     if (!userId || !authToken) {
//       console.warn("Usuário não autenticado: userId ou authToken ausentes.");
//       return thunkAPI.rejectWithValue("Usuário não autenticado");
//     }

//     try {
//       console.log("Tentando carregar usuário com userId:", userId, "e authToken:", authToken);
//       const response = await axiosInstance.get(`/${userId}`, {
//         headers: { Authorization: `Bearer ${authToken}` },
//       });
//       console.log("Resposta do servidor:", response.data);
//       return { ...response.data, id: response.data._id };
//     } catch (error) {
//       console.error("Erro ao carregar usuário:", error);
//       localStorage.removeItem("userId");
//       localStorage.removeItem("authToken");
//       return thunkAPI.rejectWithValue(
//         error.response?.data || error.message || "Erro desconhecido"
//       );
//     }
//   }
// );

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
      // .addCase(loadUserFromStorage.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(loadUserFromStorage.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.user = action.payload;
      //   state.isAuthenticated = true;
      // })
      // .addCase(loadUserFromStorage.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      //   state.user = null;
      //   state.isAuthenticated = false;
      // })
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

export const { logout } = authSlice.actions;
export default authSlice.reducer;
