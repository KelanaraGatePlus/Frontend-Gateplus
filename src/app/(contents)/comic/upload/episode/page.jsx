/* eslint-disable react/react-in-jsx-scope */
"use client";
import { Suspense } from "react";
import UploadEpisodeComicContent from "./content";

export default function UploadEpisodeComicPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadEpisodeComicContent />
    </Suspense>
  );
}
