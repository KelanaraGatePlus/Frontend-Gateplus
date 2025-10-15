import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const withdrawalAPI = createApi({
    reducerPath: "withdrawalAPI",
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
    tagTypes: ["withdrawal"],
    endpoints: (builder) => ({
        createWithdrawal: builder.mutation({
            query: (formData) => ({
                url: "/withdrawal",
                method: "POST",
                body: formData,
                formData: true,
            }),
            invalidatesTags: ["withdrawal"],
        }),
        getCreatorWithdrawal: builder.query({
            query: () => ({
                url: `/withdrawal/creator`,
                method: "GET",
            }),
            providesTags: ["withdrawal"],
            keepUnusedDataFor: 300,
        }),
        getCreatorWithdrawalById: builder.query({
            query: (id) => ({
                url: `/withdrawal/${id}`,
                method: "GET",
            }),
            providesTags: ["withdrawal"],
            keepUnusedDataFor: 300,
        }),
    }),
});

export const {
    useCreateWithdrawalMutation,
    useGetCreatorWithdrawalQuery,
    useGetCreatorWithdrawalByIdQuery,
} = withdrawalAPI;
