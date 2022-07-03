import { configureStore } from "@reduxjs/toolkit";
import { requestReducer } from "./requestsSlice";

import { userReducer } from "./userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    requests: requestReducer,
  },
});

export default store;
