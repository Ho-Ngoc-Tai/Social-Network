import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./auth/authSlice";
import { feedReducer } from "./feed/feedSlice";
import { profileReducer } from "./profile/profileSlice";
import { notificationReducer } from "./notification/notificationSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  feed: feedReducer,
  profile: profileReducer,
  notification: notificationReducer,
});
