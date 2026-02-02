"use client";
import React, { Suspense } from "react";
import UploadPodcastSeriesForm from '@/components/Form/UploadPodcast/UploadPodcastSeriesForm';
import LoadingOverlay from "@/components/LoadingOverlay/page";

export default function UploadPodcastPage() {
    return (
        <Suspense fallback={<LoadingOverlay />}>
            <UploadPodcastSeriesForm />
        </Suspense>
    );
}