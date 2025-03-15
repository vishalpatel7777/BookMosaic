import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import routesReducer from "./routesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    routes: routesReducer,
  },
});

export default store;
