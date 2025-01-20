// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import mangaReducer from "./mangaSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    manga: mangaReducer,
  },
});

export default store;
