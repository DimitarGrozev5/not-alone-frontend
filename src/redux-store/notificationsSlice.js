import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "requests",
  initialState: {
    notifications: [{
      type: "OVERWATCH_REQUEST",
    }],
  },
  reducers: {
    addNotification(state, action) {
      state.notifications.push(action.payload);
    },
    shiftNotification(state) {
      state.notifications.shift();
    },
  },
});

export const notificationActions = notificationsSlice.actions;
export const notificationReducer = notificationsSlice.reducer;
