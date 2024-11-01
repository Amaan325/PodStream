import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetErrorMessage: (state) => {
      state.error = false;
      state.loading = false;
    },
    signInStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.error = false;
      state.currentUser = action.payload;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserStart: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    updateUserSuccess: (state, action) => {
      state.loading = false;
      state.error = false;
      state.currentUser = action.payload;
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = true;
    },
    deleteUser: (state, action) => {
      state.error = false;
      state.loading = false;
      state.currentUser = action.payload;
    },
  },
});

export const {
  signInFailure,
  signInStart,
  signInSuccess,
  resetErrorMessage,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUser
} = userSlice.actions;
export default userSlice.reducer;
