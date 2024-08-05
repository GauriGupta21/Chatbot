import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Adjust the path as needed

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
