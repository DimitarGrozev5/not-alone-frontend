import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

const notificationsSlice = createSlice({
  name: "requests",
  initialState: {
    notifications: [],
    alerts: [
      // {
      //   id: nanoid(),
      //   type: "USER_IS_LATE",
      //   targetId: 1,
      //   targetName: "test",
      //   userName: "пешо",
      // },
      // {
      //   id: nanoid(),
      //   type: "USER_IS_VERY_LATE",
      //   targetId: 1,
      //   targetName: "test",
      //   userName: "пешо",
      // },
    ],
  },
  reducers: {
    addNotification(state, action) {
      const n = action.payload;
      switch (n.type) {
        case "OVERWATCH_REQUEST":
          if (!state.notifications.find((no) => no.type === n.type)) {
            state.notifications.push({
              id: nanoid(),
              targetPage: "/watching",
              ...action.payload,
            });
          }
          break;

        case "CONNECTION_REQUEST":
          if (!state.notifications.find((no) => no.type === n.type)) {
            state.notifications.push({
              id: nanoid(),
              targetPage: "/profile",
              ...action.payload,
            });
          }
          break;

        case "TRIP_STARTED":
          state.notifications.push({
            id: nanoid(),
            targetPage: `/watch/${action.payload.targetId}`,
            ...action.payload,
          });
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

    addAlert(state, action) {
      state.alerts.push({
        id: nanoid(),
        targetPage: `/watch/${action.payload.targetId}`,
        ...action.payload,
      });
    },
    removeAlert(state, action) {
      state.alerts = state.alerts.filter((n) => n.id !== action.payload);
    },
  },
});

export const notificationActions = notificationsSlice.actions;
export const notificationReducer = notificationsSlice.reducer;
