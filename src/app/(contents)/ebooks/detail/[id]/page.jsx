"use client";
import React, { use, useEffect, useState } from "react";

/*[--- COMPONENT IMPORT ---]*/
import MainTemplateLayout from "@/components/MainDetailProduct/page";

/*[--- API HOOKS ---]*/
import { useGetEbookByIdQuery } from "@/hooks/api/ebookSliceAPI";

// eslint-disable-next-line react/prop-types
export default function DetailEbookPage({ params }) {
  const { id } = use(params);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("users_id");
      setUserId(storedUserId);
      console.log(storedUserId);
    }
  }, []);

  const skip = !id || !userId;
  const { data, isLoading } = useGetEbookByIdQuery({ id, userId }, { skip });
  const ebookData = data?.data?.data || {};
  const episode_ebooks = (ebookData.episode_ebooks || []).slice().sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });


  return (
    <MainTemplateLayout
      productType="ebook"
      productDetail={ebookData}
      productEpisode={episode_ebooks}
      isLoading={isLoading}
    />
  );
}
