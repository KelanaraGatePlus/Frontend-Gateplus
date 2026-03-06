"use client";

import React from "react";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";
import { useGetLastSeenQuery } from "@/hooks/api/lastSeenSliceAPI";

export default function CarouselLastSeen() {
  const { data: lastSeenData, isLoading } = useGetLastSeenQuery();

  if (isLoading || lastSeenData.length === 0) return null;

  return (
    <div className="mb-10">
      <CarouselTemplate
        label="Terakhir Anda Lihat"
        contents={lastSeenData}
        isLoading={isLoading}
        isHomepage={true}
        withTopTag={false}
        showProgress={true}
      />
    </div>
  );
}
