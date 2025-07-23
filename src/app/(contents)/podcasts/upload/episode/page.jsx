/* eslint-disable react/react-in-jsx-scope */
"use client";
import { Suspense } from "react";
import UploadPodcastEpisodeContent from "./content";

export default function UploadPodcastEpisodePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UploadPodcastEpisodeContent />
        </Suspense>
    );
}
