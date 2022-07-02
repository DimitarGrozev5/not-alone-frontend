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
    login(state, action) {
      const { jwt, userData, connections } = action.payload;
      state.isLoggedIn = jwt;
      state.userData = userData;
      state.connections = connections;
    },
    logout(state) {
      state.isLoggedIn = null;
      state.userData = {};
      state.connections = [];
    },
    
    updateUserData(state, action) {
      state.userData = action.payload;
    },
    updateConnections(state, action) {
      state.connections = action.payload;
    },
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
