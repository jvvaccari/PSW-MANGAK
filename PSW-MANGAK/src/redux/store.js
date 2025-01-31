// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import mangaReducer from "./mangaSlice";
import evaluationReducer from "./evaluationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    manga: mangaReducer,
    evaluations: evaluationReducer
  },
});

export default store;
