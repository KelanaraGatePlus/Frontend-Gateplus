"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { ebookApi } from "../api/ebookSliceAPI";
import { podcastApi } from "../api/podcastSliceAPI";
import { filmAPI } from "../api/filmSliceAPI";
import { userAPI } from "../api/userSliceAPI";
import { homeAPI } from "../api/homeSliceAPI";
import { creatorAPI } from "../api/creatorSliceAPI";

const rootReducer = combineReducers({
  [ebookApi.reducerPath]: ebookApi.reducer,
  [podcastApi.reducerPath]: podcastApi.reducer,
  [userAPI.reducerPath]: userAPI.reducer,
  [filmAPI.reducerPath]: filmAPI.reducer,
  [homeAPI.reducerPath]: homeAPI.reducer,
  [creatorAPI.reducerPath]: creatorAPI.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ebookApi.middleware,
      podcastApi.middleware,
      userAPI.middleware,
      filmAPI.middleware,
      homeAPI.middleware,
      creatorAPI.middleware,
    ),
});

setupListeners(store.dispatch);
export default store;
