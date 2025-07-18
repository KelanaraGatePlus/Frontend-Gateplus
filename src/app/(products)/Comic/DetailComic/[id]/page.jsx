"use client";
import React from "react";
import axios from "axios";
import { use, useEffect, useState } from "react";

/*[--- COMPONENT IMPORT ---]*/
import MainTemplateLayout from "@/components/MainDetailProduct/page";

// eslint-disable-next-line react/prop-types
export default function DetailEbook({ params }) {
  const { id } = use(params);
  const [comicData, setComicData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("users_id");
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/comics/${id}?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const comicSingleData = response.data.data.data;
      console.log("ini data komik", comicSingleData);
      setComicData(comicSingleData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    comicData && (
      <MainTemplateLayout
        productType="comic"
        productDetail={comicData}
        productEpisode={comicData.episode_comics}
        isLoading={isLoading}
      />
    )
  );
}
