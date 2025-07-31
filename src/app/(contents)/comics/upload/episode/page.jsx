/* eslint-disable react/react-in-jsx-scope */
"use client";
import { Suspense } from "react";
import UploadComicEpsiodeForm from "@/components/Form/UploadComic/UploadComicEpisodeForm";

export default function UploadComicEpisodePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadComicEpsiodeForm />
    </Suspense>
  );
}
