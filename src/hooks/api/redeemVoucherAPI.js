import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const redeemVoucherAPI = createApi({
    reducerPath: "redeemVoucherAPI",
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: fetchBaseQuery({
        baseUrl: BACKEND_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token"); // bisa juga pakai cookie/sessionStorage
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["redeemVoucher"],
    endpoints: (builder) => ({
        applyRedeemVoucher: builder.mutation({
            query: (body) => ({
                url: "/redeemVoucher",
                method: "POST",
                body,
            }),
            invalidatesTags: ["redeemVoucher"], // optional: biar refresh data terkait log
        }),
    }),
});

export const {
    useApplyRedeemVoucherMutation,
} = redeemVoucherAPI;
