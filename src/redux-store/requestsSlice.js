import { createSlice } from "@reduxjs/toolkit";

const requestsSlice = createSlice({
  name: "requests",
  initialState: {
    requestsForConnectionSend: [],
    requestsForConnectionReceived: [],
    requestsForOverwatchSend: [],
    requestsForOverwatchReceived: [],
  },
  reducers: {
    updateRequests(state, action) {
      for (const key in action.payload) {
        state[key] = action.payload[key];
      }
    },
  },
});

export const requestActions = requestsSlice.actions;
export const requestReducer = requestsSlice.reducer;
