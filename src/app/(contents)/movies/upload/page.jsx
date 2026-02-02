"use client";

import React, { Suspense } from "react";
// Sesuaikan path ke hook dan komponen LoadingOverlay Anda
import UploadMovieForm from "@/components/Form/UploadMovie/uploadMovieForm";
import LoadingOverlay from "@/components/LoadingOverlay/page";

export default function UploadMoviePage() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <UploadMovieForm />
    </Suspense>
  );
}