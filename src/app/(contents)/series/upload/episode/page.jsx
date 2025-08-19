/* eslint-disable react/react-in-jsx-scope */
"use client";
import { Suspense } from "react";
import UploadSeriesEpisodeForm from "@/components/Form/UploadSeries/UploadSeriesEpisodeForm";

export default function UploadEbookEpisodePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadSeriesEpisodeForm />
    </Suspense>
  );
}
