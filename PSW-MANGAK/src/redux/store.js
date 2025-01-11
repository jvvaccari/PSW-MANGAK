import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('authToken');

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  loading: false,
  error: null,
};

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: { auth: initialState },
});

export default store;
