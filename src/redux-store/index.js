import { configureStore } from "@reduxjs/toolkit";
import { notificationReducer } from "./notificationsSlice";
import { requestReducer } from "./requestsSlice";

import { userReducer } from "./userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    notif: notificationReducer,

    // TODO: remove requests
    // requests: requestReducer,
  },
});

export default store;
