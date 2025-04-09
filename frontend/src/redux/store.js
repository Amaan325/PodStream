import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/user/userSlice";
import favoriteReducer from "../redux/podcast/favoriteSlice"; // Import favoriteReducer
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Combine reducers (add favoriteReducer)
const rootReducer = combineReducers({
  user: userReducer,
  favorites: favoriteReducer, // Add the favorites slice to the root reducer
});

// persistConfig for Redux Persist
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["user.error"], // Do not persist errors in the user slice
};

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store with the persisted reducer and middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Create a persistor to manage the persistence of the store
export const persistor = persistStore(store);
