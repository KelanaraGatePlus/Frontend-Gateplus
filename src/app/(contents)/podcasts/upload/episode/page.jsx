/* eslint-disable react/react-in-jsx-scope */
"use client";
import { Suspense } from "react";
import UploadPodcastEpisodeForm from "@/components/Form/UploadPodcast/UploadPodcastEpisodeForm";

export default function UploadPodcastEpisodePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UploadPodcastEpisodeForm />
        </Suspense>
    );
}
