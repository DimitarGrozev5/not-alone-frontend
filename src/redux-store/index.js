import { configureStore } from "@reduxjs/toolkit";
import { gpsReducer } from "./gpsSlice";
import { notificationReducer } from "./notificationsSlice";

import { userReducer } from "./userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    notif: notificationReducer,
    gps: gpsReducer,
  },
});

export default store;
