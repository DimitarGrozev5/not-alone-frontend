import { createSlice } from "@reduxjs/toolkit";

const gpsSlice = createSlice({
  name: "gps",
  initialState: {
    record: false,
  },
  reducers: {
    setRecordTo(state, action) {
      state.record = !!action.payload;
    },
  },
});

export const gpsActions = gpsSlice.actions;
export const gpsReducer = gpsSlice.reducer;
