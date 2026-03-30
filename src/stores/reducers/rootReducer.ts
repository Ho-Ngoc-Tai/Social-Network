import { combineReducers } from "@reduxjs/toolkit";

import { authReducer } from "@/stores/reducers/authSlice";
import { feedReducer } from "@/stores/reducers/feedSlice";
import { profileReducer } from "@/stores/reducers/profileSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  feed: feedReducer,
  profile: profileReducer,
});
