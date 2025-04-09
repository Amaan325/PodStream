import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state for favorite podcasts
const initialState = {
  favoritePodcasts: [],  // Array holding full podcast data
  loading: false,
  error: null,
};

// Create a slice for favorite podcasts
const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavorites: (state, action) => {
      state.favoritePodcasts = action.payload;  // Set full podcast data
    },
    addFavorite: (state, action) => {
      state.favoritePodcasts.push(action.payload);  // Add podcast to favorites
    },
    removeFavorite: (state, action) => {
      state.favoritePodcasts = state.favoritePodcasts.filter(
        (podcast) => podcast._id !== action.payload._id
      );  // Remove podcast from favorites
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Export the actions
export const { setFavorites, addFavorite, removeFavorite, setLoading, setError } = favoriteSlice.actions;

// Thunk to fetch favorite podcasts from the API
export const fetchFavorites = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`http://localhost:3000/favorite/get/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Store the full podcast data in Redux
    dispatch(setFavorites(response.data));
  } catch (error) {
    dispatch(setError("Error fetching favorite podcasts"));
  } finally {
    dispatch(setLoading(false));
  }
};

// Export the reducer to be added to the store
export default favoriteSlice.reducer;
