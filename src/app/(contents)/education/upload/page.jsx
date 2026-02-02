"use client";

import React, { Suspense } from "react";
// Sesuaikan path ke hook dan komponen LoadingOverlay Anda
import UploadEducationForm from "@/components/Form/UploadEducation/UploadEducationForm";
import LoadingOverlay from "@/components/LoadingOverlay/page";

export default function UploadSeriesPage() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <UploadEducationForm />
    </Suspense>
  );
}