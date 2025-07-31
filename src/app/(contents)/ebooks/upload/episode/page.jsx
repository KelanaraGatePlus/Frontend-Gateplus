/* eslint-disable react/react-in-jsx-scope */
"use client";
import { Suspense } from "react";
import UploadEbookEpisodeForm from '@/components/Form/UploadEbook/UploadEbookEpisodeForm';

export default function UploadEbookEpisodePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadEbookEpisodeForm />
    </Suspense>
  );
}
