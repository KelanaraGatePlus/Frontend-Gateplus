"use client";
import React, { Suspense } from "react";
import BackButton from "@/components/BackButton/page";
import FilteredEbookContent from "./filteredEbookContent";

export default function EbooksByGenrePage() {
  return (
    <main className="relative mx-2 my-2 mt-16 flex flex-col md:mt-24 lg:mx-6">
      <div className="z-0 px-3">
        <BackButton />
      </div>

      <Suspense
        fallback={<div className="text-white">Loading konten...</div>}
      >
        <FilteredEbookContent />
      </Suspense>
    </main>
  );
}
