import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const oneTimePasswordAPI = createApi({
    reducerPath: "oneTimePasswordAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: BACKEND_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['oneTimePassword'], // ⬅️ tambahkan 'oneTimePassword'
    endpoints: (builder) => ({
        createEmailOTP: builder.mutation({
            query: () => ({
                url: "/otp/email",
                method: "POST",
            }),
            invalidatesTags: ["oneTimePassword"],
        }),
        verifyEmail: builder.mutation({
            query: (otpData) => ({
                url: "/otp/verify-email",
                method: "POST",
                body: otpData,
            }),
            invalidatesTags: ["oneTimePassword"],
        }),
    }),
});

export const { useCreateEmailOTPMutation, useVerifyEmailMutation } = oneTimePasswordAPI;
