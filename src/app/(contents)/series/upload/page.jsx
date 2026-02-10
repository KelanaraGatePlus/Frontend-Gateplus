"use client";

import React, { Suspense } from "react";
// Sesuaikan path ke hook dan komponen LoadingOverlay Anda
import UploadSeriesForm from "@/components/Form/UploadSeries/UploadSeriesForm";
import LoadingOverlay from "@/components/LoadingOverlay/page";

export default function UploadSeriesPage() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <UploadSeriesForm />
    </Suspense>
  );
}