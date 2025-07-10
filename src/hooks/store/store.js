"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { ebookApi } from "../api/ebookSliceAPI";
import { filmAPI } from "../api/filmSliceAPI";
import { userAPI } from "../api/userSliceAPI";

const rootReducer = combineReducers({
  [ebookApi.reducerPath]: ebookApi.reducer,
  [userAPI.reducerPath]: userAPI.reducer,
  [filmAPI.reducerPath]: filmAPI.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ebookApi.middleware,
      userAPI.middleware,
      filmAPI.middleware,
    ),
});

setupListeners(store.dispatch);
export default store;
