import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../services/axiosInstance";

const BASE_URL = "https://localhost:5502/accounts";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    console.log("Tentando login com:", { email, password }); // Logando as credenciais enviadas

    try {
      const response = await axiosInstance.post(`/login`, {
        email,
        password,
      });
      
      console.log("Resposta da API:", response); // Logando a resposta da API

      const foundUser = response.data;
      
      // Verificando se a resposta tem dados
      if (!foundUser) {
        console.log("Nenhum usuário encontrado com essas credenciais.");
        throw new Error("Credenciais inválidas.");
      }

      console.log("Usuário encontrado:", foundUser); // Logando o usuário encontrado

      const userWithToken = { 
        ...foundUser, 
        id: foundUser._id, 
        token: foundUser.accessToken 
      };      
      
      console.log("Usuário com token:", userWithToken); // Logando o usuário com o token

      // Armazenando os dados no localStorage
      localStorage.setItem("userId", userWithToken.id);
      localStorage.setItem("authToken", userWithToken.token);

      // Configurando o cabeçalho Authorization globalmente
      axiosInstance.defaults.headers["Authorization"] = `Bearer ${userWithToken.token}`;
      console.log("Cabeçalho Authorization configurado:", axiosInstance.defaults.headers["Authorization"]);

      return userWithToken;
    } catch (error) {
      // Logando o erro
      console.error("Erro ao tentar login:", error); 
      const errorMessage = error.response?.data || error.message || "Erro desconhecido";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/register`, {
        username,
        email,
        password,
      });
      
      const newUser = response.data;
      console.log(newUser);

      // Agora você já tem o token na resposta do backend
      const { accessToken, refreshToken, user } = newUser;

      if (!user || !accessToken) {
        throw new Error("Erro ao criar usuário.");
      }

      // Armazenando os tokens no localStorage
      localStorage.setItem("userId", user._id);
      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return { user, accessToken, refreshToken };
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
    const authToken = localStorage.getItem("authToken"); // Pega o token do localStorage
    if (!userId || !authToken) return null; // Verifica se o userId e o token existem

    try {
      const response = await axios.get(`${BASE_URL}/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Adiciona o token no cabeçalho
        },
      });

      if (!response.data) {
        throw new Error("Usuário não encontrado");
      }

      const userWithId = { ...response.data, id: response.data._id };
      return userWithId; 
    } catch (error) {
      localStorage.removeItem("userId");
      localStorage.removeItem("authToken"); // Também remove o token se der erro
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
