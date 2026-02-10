"use client";
import React, { Suspense } from "react";
import UploadEbookSeriesForm from '@/components/Form/UploadEbook/UploadEbookSeriesForm';
import LoadingOverlay from "@/components/LoadingOverlay/page";

export default function UploadEbookPage() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <UploadEbookSeriesForm />
    </Suspense>
  );
}