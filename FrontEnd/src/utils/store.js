import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import selectedPostSlice from "./selectedPostSlice";
import commentSlice from "./commentSlice";
export const store = configureStore({
  reducer: {
    user: userSlice,
    post: selectedPostSlice,
    comment: commentSlice,
  },
});