import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const paymentAPI = createApi({
    reducerPath: "paymentAPI",
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
    tagTypes: ["paymentAPI"],
    endpoints: (builder) => ({
        createOrderPayment: builder.mutation({
            query: (payload) => ({
                url: "/api/payment/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["paymentAPI"],
        }),
        createSubscriptionPayment: builder.mutation({
            query: (payload) => ({
                url: "/api/payment/create-subscription",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["paymentAPI"],
        }),
        createCoinPayment: builder.mutation({
            query: (payload) => ({
                url: "/api/payment/coin",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["paymentAPI"],
        }),
        createTipPayment: builder.mutation({
            query: (payload) => ({
                url: "/api/payment/create-tip",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["paymentAPI"],
        }),
        checkPaymentStatus: builder.mutation({
            query: (orderId) => ({
                url: `/api/payment/status/${orderId}`,
                method: "GET",
            }),
        }),
        payWithCoin: builder.mutation({
            query: (payload) => ({
                url: "/api/payment/payWithCoin",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["paymentAPI"],
        }),
    }),
});

export const {
    useCreateOrderPaymentMutation,
    useCreateSubscriptionPaymentMutation,
    useCreateCoinPaymentMutation,
    useCreateTipPaymentMutation,
    useCheckPaymentStatusMutation,
    usePayWithCoinMutation,
} = paymentAPI;
