import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

const notificationsSlice = createSlice({
  name: "requests",
  initialState: {
    notifications: [{ id: nanoid(), type: "OVERWATCH_REQUEST" }],
  },
  reducers: {
    addNotification(state, action) {
      state.notifications.push({ id: nanoid(), ...action.payload });
    },
    removeNotification(state, action) {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
  },
});

export const notificationActions = notificationsSlice.actions;
export const notificationReducer = notificationsSlice.reducer;
