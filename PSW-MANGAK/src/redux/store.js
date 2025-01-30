// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import mangaReducer from "./mangaSlice";
import evaluationsReducer from './evaluationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    manga: mangaReducer,
    evaluations: evaluationsReducer,
  },
});

export default store;
