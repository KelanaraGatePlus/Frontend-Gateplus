/* eslint-disable react/react-in-jsx-scope */
"use client";
import { Suspense } from "react";
import UploadComicEpisodeContent from "./content";

export default function UploadComicEpisodePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadComicEpisodeContent />
    </Suspense>
  );
}
