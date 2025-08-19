"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { ebookApi } from "../api/ebookSliceAPI";
import { comicApi } from "../api/comicSliceAPI";
import { podcastApi } from "../api/podcastSliceAPI";
import { movieAPI } from "../api/movieSliceAPI";
import { userAPI } from "../api/userSliceAPI";
import { homeAPI } from "../api/homeSliceAPI";
import { creatorAPI } from "../api/creatorSliceAPI";
import { contentAPI } from "../api/contentSliceAPI";
import { genreAPI } from "../api/genreSliceAPI";
import { commentAPI } from "../api/commentSliceAPI";
import { uploadSessionApi } from "../api/uploadSessionAPI";
import { seriesAPI } from "../api/seriesSliceAPI";

const rootReducer = combineReducers({
  [ebookApi.reducerPath]: ebookApi.reducer,
  [comicApi.reducerPath]: comicApi.reducer,
  [podcastApi.reducerPath]: podcastApi.reducer,
  [userAPI.reducerPath]: userAPI.reducer,
  [movieAPI.reducerPath]: movieAPI.reducer,
  [homeAPI.reducerPath]: homeAPI.reducer,
  [creatorAPI.reducerPath]: creatorAPI.reducer,
  [contentAPI.reducerPath]: contentAPI.reducer,
  [genreAPI.reducerPath]: genreAPI.reducer,
  [commentAPI.reducerPath]: commentAPI.reducer,
  [uploadSessionApi.reducerPath]: uploadSessionApi.reducer,
  [seriesAPI.reducerPath]: seriesAPI.reducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ebookApi.middleware,
      comicApi.middleware,
      podcastApi.middleware,
      userAPI.middleware,
      movieAPI.middleware,
      homeAPI.middleware,
      creatorAPI.middleware,
      contentAPI.middleware,
      genreAPI.middleware,
      commentAPI.middleware,
      uploadSessionApi.middleware,
      seriesAPI.middleware
    ),
});

setupListeners(store.dispatch);
export default store;
