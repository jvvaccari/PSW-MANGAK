// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5501/accounts";

/**
 * Thunk: loginUser
 * 1. Fetches all accounts from BASE_URL
 * 2. Finds a matching account by email and password
 * 3. If found, saves userId to localStorage and returns the foundUser
 * 4. If not found, rejects with an error message
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.get(BASE_URL);
      const foundUser = response.data.find(
        (account) =>
          account.email === email && account.password === password
      );

      if (!foundUser) {
        throw new Error("Credenciais inválidas.");
      }

      localStorage.setItem("userId", foundUser.id); // Persist userId in localStorage
      return foundUser;
    } catch (error) {
      const errorMessage = error.message || "Erro desconhecido";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

/**
 * Thunk: registerUser
 * 1. Fetches all accounts from BASE_URL
 * 2. Checks if email already exists
 * 3. If it doesn't, creates a new user object, posts it to the server,
 *    saves userId to localStorage, and returns the newly created user
 * 4. If user already exists, rejects with an error message
 */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, thunkAPI) => {
    try {
      const response = await axios.get(BASE_URL);
      const existingUser = response.data.find(
        (account) => account.email === email
      );

      if (existingUser) {
        throw new Error("O e-mail já está em uso.");
      }

      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password,
        favorites: [],
        role: "user",
      };

      await axios.post(BASE_URL, newUser);
      localStorage.setItem("userId", newUser.id); // Persist userId in localStorage
      return newUser;
    } catch (error) {
      const errorMessage = error.message || "Erro ao registrar usuário";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

/**
 * Thunk: loadUserFromStorage
 * 1. Checks if "userId" exists in localStorage
 * 2. If yes, fetches that user from the server
 * 3. If user is found, returns user; if not, removes "userId" and rejects
 * 4. If "userId" doesn't exist, returns null
 */
export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUser",
  async (_, thunkAPI) => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const response = await axios.get(`${BASE_URL}/${userId}`);
        if (!response.data) {
          throw new Error("Usuário não encontrado");
        }
        return response.data; // Return user to Redux
      } catch (error) {
        localStorage.removeItem("userId"); // Remove invalid userId
        return thunkAPI.rejectWithValue(
          `Erro ao carregar usuário: ${error.message || "Erro desconhecido"}`
        );
      }
    }
    return null; // No userId in localStorage
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
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
