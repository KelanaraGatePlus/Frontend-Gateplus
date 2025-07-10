import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url = "https://backend-gateplus-api.my.id";

export const userAPI = createApi({
  reducerPath: "usersAPI",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    credentials: "include",
  }),
  tagTypes: ["usersAPI"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["usersAPI"],
      keepUnusedDataFor: 5,
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
  useGetMeQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
} = userAPI;
