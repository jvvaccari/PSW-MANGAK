// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// You can keep this base for /accounts, or use a more general API_URL 
// if you prefer. The key is that we have /accounts/login & /accounts/register.
const BASE_URL = "http://localhost:5502/accounts";

/**
 * Thunk: loginUser
 * 
 * Calls POST /accounts/login with { email, password }.
 * If successful, saves userId to localStorage. Otherwise, rejects with an error.
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });
      const foundUser = response.data; // The server returns the user object

      if (!foundUser) {
        throw new Error("Credenciais inválidas.");
      }

      // Use either foundUser._id or foundUser.id, depending on how your server returns it
      const userWithId = { ...foundUser, id: foundUser._id };
      localStorage.setItem("userId", userWithId.id);

      return userWithId;

    } catch (error) {
      // If the server throws a 401 or other error, you can capture it here
      const errorMessage =
        error.response?.data || error.message || "Erro desconhecido";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

/**
 * Thunk: registerUser
 * 
 * Calls POST /accounts/register with { username, email, password }.
 * If successful, saves userId to localStorage. Otherwise, rejects with an error.
 */
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

/**
 * Thunk: loadUserFromStorage
 * 
 * Checks if "userId" exists in localStorage.
 * If yes, fetches that user from GET /accounts/:id.
 * If not found, removes "userId" and rejects.
 */
export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUser",
  async (_, thunkAPI) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return null; // No userId in localStorage

    try {
      const response = await axios.get(`${BASE_URL}/${userId}`);
      if (!response.data) {
        throw new Error("Usuário não encontrado");
      }
      const userWithId = { ...response.data, id: response.data._id };
      return userWithId; // Return user to Redux
    } catch (error) {
      localStorage.removeItem("userId"); // Remove invalid userId
      return thunkAPI.rejectWithValue(
        `Erro ao carregar usuário: ${error.response?.data || error.message || "Erro desconhecido"}`
      );
    }
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,       // Holds the user object once logged in
    loading: false,   // For showing spinners during async ops
    error: null,      // Stores error messages from login/register
  },
  reducers: {
    /**
     * logout reducer
     * 1. Sets state.user to null
     * 2. Removes "userId" from localStorage
     */
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("userId");
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser
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

      // registerUser
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

      // loadUserFromStorage
      .addCase(loadUserFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // null if not found
      })
      .addCase(loadUserFromStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null; // Remove user on error
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
