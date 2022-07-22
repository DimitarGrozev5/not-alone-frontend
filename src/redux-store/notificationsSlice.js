import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

const notificationsSlice = createSlice({
  name: "requests",
  initialState: {
    notifications: [],
  },
  reducers: {
    addNotification(state, action) {
      const n = action.payload;
      switch (n.type) {
        case "OVERWATCH_REQUEST":
        case "CONNECTION_REQUEST":
          if (
            !state.notifications.find((no) => no.type === n.type)
          ) {
            state.notifications.push({ id: nanoid(), ...action.payload });
          }
          break;

        default:
          break;
      }
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
