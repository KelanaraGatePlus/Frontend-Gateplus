"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { ebookApi } from "../api/ebookSliceAPI";
import { comicApi } from "../api/comicSliceAPI";
import { podcastApi } from "../api/podcastSliceAPI";
import { filmAPI } from "../api/filmSliceAPI";
import { userAPI } from "../api/userSliceAPI";
import { homeAPI } from "../api/homeSliceAPI";
import { creatorAPI } from "../api/creatorSliceAPI";
import { genreAPI } from "../api/genreSliceAPI";

const rootReducer = combineReducers({
  [ebookApi.reducerPath]: ebookApi.reducer,
  [comicApi.reducerPath]: comicApi.reducer,
  [podcastApi.reducerPath]: podcastApi.reducer,
  [userAPI.reducerPath]: userAPI.reducer,
  [filmAPI.reducerPath]: filmAPI.reducer,
  [homeAPI.reducerPath]: homeAPI.reducer,
  [creatorAPI.reducerPath]: creatorAPI.reducer,
  [genreAPI.reducerPath]: genreAPI.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ebookApi.middleware,
      comicApi.middleware,
      podcastApi.middleware,
      userAPI.middleware,
      filmAPI.middleware,
      homeAPI.middleware,
      creatorAPI.middleware,
      genreAPI.middleware,
    ),
});

setupListeners(store.dispatch);
export default store;
