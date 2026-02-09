import React from "react";
import { useGetNewestQuery } from "@/hooks/api/homeSliceAPI.js";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";

export default function CarouselNewest({ isBlurred }) {
  const { data, isLoading } = useGetNewestQuery();
  const newestData = data?.data || [];

  return (
    <CarouselTemplate
      label={"Newest"}
      contents={newestData}
      isLoading={isLoading}
      withTopTag={false}
      withNewestTag={true}
      isBlurred={isBlurred} // Tambahkan baris ini
    />
  );
}
