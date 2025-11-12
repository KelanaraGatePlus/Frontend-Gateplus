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
            query: ({ jwtToken }) => ({
                url: "/otp/email",
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                }
            }),
            invalidatesTags: ["oneTimePassword"],
        }),
        verifyEmail: builder.mutation({
            query: ({ token, jwtToken }) => ({
                url: "/otp/verify-email",
                method: "POST",
                body: { token },
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                }
            }),
            invalidatesTags: ["oneTimePassword"],
        }),
    }),
});

export const { useCreateEmailOTPMutation, useVerifyEmailMutation } = oneTimePasswordAPI;
