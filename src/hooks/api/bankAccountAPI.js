import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const bankAccountAPI = createApi({
    reducerPath: "bankAccountAPI",
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
    tagTypes: ["bankAccount"],
    endpoints: (builder) => ({
        getAllBankAccountByCreator: builder.query({
            query: () => `/bankAccount`,
            providesTags: ["bankAccount"],
            keepUnusedDataFor: 6000,
        }),
        postBankAccount: builder.mutation({
            query: (formData) => ({
                url: "/bankAccount",
                method: "POST",
                body: formData,
                formData: true,
            }),
            invalidatesTags: ["bankAccount"],
        }),
    }),
});

export const {
    useGetAllBankAccountByCreatorQuery,
    usePostBankAccountMutation,
} = bankAccountAPI;
