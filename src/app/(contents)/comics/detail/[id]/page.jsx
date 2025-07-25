"use client";
import React from "react";
import { use, useEffect, useState } from "react";
import PropTypes from "prop-types";

/*[--- API HOOKS ---]*/
import { useGetComicByIdQuery } from "@/hooks/api/comicSliceAPI";

/*[--- UI COMPONENTS ---]*/
import MainTemplateLayout from "@/components/MainDetailProduct/page";

export default function DetailComicPage({ params }) {
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
  const { data, isLoading } = useGetComicByIdQuery({ id, userId }, { skip });
  const comicData = data?.data?.data || {};
  const episode_comics = (comicData.episode_comics || []).slice().sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  return (
    comicData && (
      <MainTemplateLayout
        productType="comic"
        productDetail={comicData}
        productEpisode={episode_comics}
        isLoading={isLoading}
      />
    )
  );
}

DetailComicPage.propTypes = {
  params: PropTypes.string,
}