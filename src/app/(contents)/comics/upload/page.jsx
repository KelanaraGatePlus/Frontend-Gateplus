"use client";
import React, { Suspense } from "react";
import UploadComicSeriesForm from '@/components/Form/UploadComic/UploadComicSeriesForm';
import LoadingOverlay from "@/components/LoadingOverlay/page";

export default function UploadEbookPage() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <UploadComicSeriesForm />
    </Suspense>
  );
}