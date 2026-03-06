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
import { logApi } from "../api/logSliceAPI";
import { progressWatchAPI } from "../api/progressWatchAPI";
import { reportContentAPI } from "../api/reportContentAPI";
import { categoryAPI } from "../api/categorySliceAPI";
import { bankAPI } from "../api/bankSliceAPI";
import { bankAccountAPI } from "../api/bankAccountAPI";
import { withdrawalAPI } from "../api/withdrawalAPI";
import { searchAPI } from "../api/searchAPI";
import { faqArticleAPI } from "../api/faqArticleAPI";
import { discountVoucherAPI } from "../api/discountVoucherAPI";
import { redeemVoucherAPI } from "../api/redeemVoucherAPI";
import { savedContentAPI } from "../api/savedContentAPI";
import { oneTimePasswordAPI } from "../api/oneTimePasswordAPI";
import { educationAPI } from "../api/educationSliceAPI";
import { educationCategoryAPI } from "../api/educationCategorySliceAPI";
import { educationEpisodeAPI } from "../api/educationEpisodeSliceAPI";
import { quizAPI } from "../api/quizSliceAPI";
import { certificateEducation } from "../api/certificateEducationAPI";
import { readProgressAPI } from "../api/readProgressAPI";
import { episodeSeriesSliceAPI } from "../api/episodeSeriesSliceAPI";
import { episodePodcastSliceAPI } from "../api/episodePodcastSliceAPI";
import { episodeEbookSliceAPI } from "../api/episodeEbookSliceAPI";
import { episodeComicSliceAPI } from "../api/episodeComicSliceAPI";
import { notificationAPI } from "../api/notificationSliceAPI";
import { reportCommentAPI } from "../api/reportCommentAPI";
import { lastSeenSliceAPI } from "../api/lastSeenSliceAPI";
import { coinPackageAPI } from "../api/coinPackageAPI";
import { paymentAPI } from "../api/paymentSliceAPI";

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
  [seriesAPI.reducerPath]: seriesAPI.reducer,
  [logApi.reducerPath]: logApi.reducer,
  [progressWatchAPI.reducerPath]: progressWatchAPI.reducer,
  [reportContentAPI.reducerPath]: reportContentAPI.reducer,
  [categoryAPI.reducerPath]: categoryAPI.reducer,
  [bankAPI.reducerPath]: bankAPI.reducer,
  [bankAccountAPI.reducerPath]: bankAccountAPI.reducer,
  [withdrawalAPI.reducerPath]: withdrawalAPI.reducer,
  [searchAPI.reducerPath]: searchAPI.reducer,
  [faqArticleAPI.reducerPath]: faqArticleAPI.reducer,
  [discountVoucherAPI.reducerPath]: discountVoucherAPI.reducer,
  [redeemVoucherAPI.reducerPath]: redeemVoucherAPI.reducer,
  [savedContentAPI.reducerPath]: savedContentAPI.reducer,
  [oneTimePasswordAPI.reducerPath]: oneTimePasswordAPI.reducer,
  [educationAPI.reducerPath]: educationAPI.reducer,
  [educationCategoryAPI.reducerPath]: educationCategoryAPI.reducer,
  [educationEpisodeAPI.reducerPath]: educationEpisodeAPI.reducer,
  [quizAPI.reducerPath]: quizAPI.reducer,
  [certificateEducation.reducerPath]: certificateEducation.reducer,
  [readProgressAPI.reducerPath]: readProgressAPI.reducer,
  [episodeSeriesSliceAPI.reducerPath]: episodeSeriesSliceAPI.reducer,
  [episodePodcastSliceAPI.reducerPath]: episodePodcastSliceAPI.reducer,
  [episodeEbookSliceAPI.reducerPath]: episodeEbookSliceAPI.reducer,
  [episodeComicSliceAPI.reducerPath]: episodeComicSliceAPI.reducer,
  [notificationAPI.reducerPath]: notificationAPI.reducer,
  [reportCommentAPI.reducerPath]: reportCommentAPI.reducer,
  [lastSeenSliceAPI.reducerPath]: lastSeenSliceAPI.reducer,
  [coinPackageAPI.reducerPath]: coinPackageAPI.reducer,
  [paymentAPI.reducerPath]: paymentAPI.reducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // ✅ TAMBAHKAN INI - Prevent unnecessary re-renders
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
      immutableCheck: {
        // Reduce checks for better performance
        warnAfter: 128,
      },
    }).concat(
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
      seriesAPI.middleware,
      logApi.middleware,
      progressWatchAPI.middleware,
      reportContentAPI.middleware,
      categoryAPI.middleware,
      bankAPI.middleware,
      bankAccountAPI.middleware,
      withdrawalAPI.middleware,
      searchAPI.middleware,
      faqArticleAPI.middleware,
      discountVoucherAPI.middleware,
      redeemVoucherAPI.middleware,
      savedContentAPI.middleware,
      oneTimePasswordAPI.middleware,
      educationAPI.middleware,
      educationCategoryAPI.middleware,
      educationEpisodeAPI.middleware,
      quizAPI.middleware,
      certificateEducation.middleware,
      readProgressAPI.middleware,
      episodeSeriesSliceAPI.middleware,
      episodePodcastSliceAPI.middleware,
      episodeEbookSliceAPI.middleware,
      episodeComicSliceAPI.middleware,
      notificationAPI.middleware,
      reportCommentAPI.middleware,
      lastSeenSliceAPI.middleware,
      coinPackageAPI.middleware,
      paymentAPI.middleware
    ),
});

setupListeners(store.dispatch);
export default store;
