import { configureStore } from "@reduxjs/toolkit";
import { notificationReducer } from "./notificationsSlice";

import { userReducer } from "./userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    notif: notificationReducer,
  },
});

export default store;
