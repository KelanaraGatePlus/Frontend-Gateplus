import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const bankAPI = createApi({
    reducerPath: "bankAPI",
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: fetchBaseQuery({
        baseUrl: BACKEND_URL,
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["bank"],
    endpoints: (builder) => ({
        getAllBank: builder.query({
            query: () => `/bank`,
            providesTags: ["bank"],
            keepUnusedDataFor: 6000,
        }),
    }),
});

export const {
    useGetAllBankQuery
} = bankAPI;
