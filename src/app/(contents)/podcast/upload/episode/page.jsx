/* eslint-disable react/react-in-jsx-scope */
"use client";
import { Suspense } from "react";
import UploadEpisodePageContent from "./content";

export default function UploadEpisodePodcastPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UploadEpisodePageContent />
        </Suspense>
    );
}
