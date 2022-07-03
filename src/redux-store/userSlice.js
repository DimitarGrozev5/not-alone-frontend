import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    // False if not logged in
    // JWT if logged in
    isLoggedIn: false,

    // Data about the user
    userData: {
      email: null,
      name: null,
      phone: null,
    },

    // People the user is connected to
    connections: [],
  },
  reducers: {
    updateAccessToken(state, action) {
      state.isLoggedIn = action.payload;
    },

    logout(state) {
      state.isLoggedIn = null;
      state.userData = {};
      state.connections = [];
    },

    updateUserData(state, action) {
      for (const key in action.payload) {
        state[key] = action.payload[key];
      }
    },
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
