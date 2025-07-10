/* eslint-disable react/react-in-jsx-scope */
"use client";
import { Suspense } from "react";
import UploadEpisodeComicContent from "./content";

export default function UploadEpisodeComic() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadEpisodeComicContent />
    </Suspense>
  );
}
