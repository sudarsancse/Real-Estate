import {configureStore} from "@reduxjs/toolkit";
import useReducer from "./User/userSlice";

export const store = configureStore({
  reducer: {
    user: useReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
