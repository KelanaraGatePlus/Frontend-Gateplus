import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url = "http://localhost:3000";

export const userAPI = createApi({
  reducerPath: "usersAPI",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["usersAPI"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["usersAPI"],
      keepUnusedDataFor: 5,
    }),
    getUserDetail: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["usersAPI"],
      keepUnusedDataFor: 60,
    }),
    getMe: builder.query({
      query: () => "/users/authMe",
      providesTags: ["usersAPI"],
    }),
    registerUser: builder.mutation({
      query: (newUser) => ({
        url: "users/register",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["usersAPI"],
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "users/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["usersAPI"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserDetailQuery,
  useGetMeQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
} = userAPI;
