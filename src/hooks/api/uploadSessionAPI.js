// src/services/uploadSessionApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const uploadSessionApi = createApi({
    reducerPath: "uploadSessionApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BACKEND_URL}/uploadSession`,
        prepareHeaders: (headers) => {
            // Assuming you might use token-based auth in the future
            // const token = localStorage.getItem("token");
            // if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        // Initiates the multipart upload session
        initiateUpload: builder.mutation({
            query: ({ fileSize, chunkSize, prefix, fileName, contentType }) => ({
                url: "/initiate",
                method: "POST",
                body: { fileSize, chunkSize, prefix, fileName, contentType },
            }),
        }),

        // Gets the status of an existing upload session
        getUploadStatus: builder.mutation({
            query: ({ key, uploadId }) => ({
                url: "/status",
                method: "POST",
                body: { key, uploadId },
            }),
        }),

        // Gets a pre-signed URL for a specific chunk
        getSignedUrlForChunk: builder.mutation({
            query: ({ key, uploadId, partNumber, uploadUID }) => ({
                url: "/chunk",
                method: "POST",
                body: { key, uploadId, partNumber, uploadUID },
            }),
        }),

        // Completes the multipart upload
        completeUpload: builder.mutation({
            query: ({ key, uploadId, uploadUID, parts }) => ({
                url: "/complete",
                method: "POST",
                body: { key, uploadId, uploadUID, parts },
            }),
        }),

        // Cancels/aborts the multipart upload
        cancelUpload: builder.mutation({
            query: ({ key, uploadId, uploadUID }) => ({
                url: "/cancel",
                method: "POST",
                body: { key, uploadId, uploadUID },
            }),
        }),
    }),
});

export const {
    useInitiateUploadMutation,
    useGetUploadStatusMutation,
    useGetSignedUrlForChunkMutation,
    useCompleteUploadMutation,
    useCancelUploadMutation,
} = uploadSessionApi;