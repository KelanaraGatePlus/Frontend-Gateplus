"use client";
import React, { use, useEffect, useState } from "react";
import axios from "axios";

/*[--- COMPONENT IMPORT ---]*/
import MainTemplateLayout from "@/components/template/page";

// eslint-disable-next-line react/prop-types
export default function DetailEbook({ params }) {
  const { id } = use(params);
  const [ebookData, setEbookData] = useState({});

  const getData = async () => {
    try {
      const userId = localStorage.getItem("users_id");
      const response = await axios.get(
        `https://backend-gateplus-api.my.id/ebooks/${id}?userId=${userId}`,
      );
      const ebookSingleData = response.data.data.data;
      console.log("ini das", ebookSingleData);
      setEbookData(ebookSingleData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    ebookData && (
      <MainTemplateLayout
        productType="ebook"
        productDetail={ebookData}
        productEpisode={ebookData.episode_ebooks}
      />
    )
  );
}
