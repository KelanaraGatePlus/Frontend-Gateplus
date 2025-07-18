"use client";
import React, { Suspense } from "react";
import BackPage from "@/components/BackPage/page";
import FilteredEbookContent from "./filteredEbookContent";

export default function CategoryFilter() {
  return (
    <main className="relative mx-2 my-2 mt-16 flex flex-col md:mt-24 lg:mx-6">
      <div className="z-0 px-3">
        <BackPage />
      </div>

      <Suspense
        fallback={<div className="text-white">Loading konten...</div>}
      >
        <FilteredEbookContent />
      </Suspense>
    </main>
  );
}
