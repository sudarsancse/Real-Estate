import {combineReducers, configureStore} from "@reduxjs/toolkit";
import useReducer from "./User/userSlice";
import {persistReducer, persistStore} from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({user: useReducer});

const parsistConfig = {
  key: "root",
  storage,
  version: 1,
};
const persistedReducer = persistReducer(parsistConfig, rootReducer);

export const store = configureStore({
  reducer: {persistedReducer},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
