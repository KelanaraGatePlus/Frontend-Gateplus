/* eslint-disable react/react-in-jsx-scope */
"use client";
import { Suspense } from "react";
import UploadEbookEpisodeContent from "./content";

export default function UploadEbookEpisodePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadEbookEpisodeContent />
    </Suspense>
  );
}
