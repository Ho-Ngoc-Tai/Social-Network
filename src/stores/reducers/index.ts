import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './auth-slice';
import { postsReducer } from './posts-slice';
import { feedReducer } from './feed-slice';
import { profileReducer } from './profile-slice';
import { notificationsReducer } from './notifications-slice';
import { uiReducer } from './ui-slice';

export const rootReducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
  feed: feedReducer,
  profile: profileReducer,
  notifications: notificationsReducer,
  ui: uiReducer,
});
