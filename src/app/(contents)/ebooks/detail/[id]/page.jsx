"use client";
import React from "react";
import { useState, useEffect } from 'react';

/*[--- COMPONENT IMPORT ---]*/
import MainTemplateLayout from "@/components/MainDetailProduct/page";
import { useGetUserId } from "@/lib/features/useGetUserId";

/*[--- API HOOKS ---]*/
import { useGetEbookByIdQuery } from "@/hooks/api/ebookSliceAPI";
import SimpleModal from "@/components/Modal/SimpleModal";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";

// eslint-disable-next-line react/prop-types
export default function DetailEbookPage({ params }) {
  const { id } = React.use(params);
  const userId = useGetUserId();
  const [loading, setLoading] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSubscribeOpen, setIsModalSubscribeOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [createLog] = useCreateLogMutation();

  const handleModalOpen = (episodeId, price) => {
    setSelectedEpisode(episodeId);
    setSelectedPrice(price);
    setIsModalOpen(true);
  };

  const handleModalSubscribeOpen = (contentId, price) => {
    setSelectedContentId(contentId);
    setSelectedPrice(price);
    setIsModalSubscribeOpen(true);
  };

  const handleBuy = async () => {
    setLoading(true);
    window.location.href = `/checkout/purchase/ebooks/${id}/${selectedEpisode}`;
    setIsModalOpen(false);
    setLoading(false);
  };

  const handleSubscribe = async () => {
    setLoading(true);
    window.location.href = `/checkout/subscribe/ebooks/${selectedContentId}`;
    setIsModalSubscribeOpen(false);
    setLoading(false);
  };

  const skip = !id || !userId;
  const { data, isLoading } = useGetEbookByIdQuery({ id, userId }, { skip });
  const ebookData = data?.data || {};
  const episode_ebooks = (ebookData?.episode_ebooks?.episodes || []).slice().sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  useEffect(() => {
    createLog({
      contentType: "EBOOK",
      logType: "CLICK",        // atau WATCH_TRAILER / WATCH_CONTENT sesuai kebutuhan
      contentId: id,
    });
  }, [id, createLog]);

  return (
    <div>
      <MainTemplateLayout
        productType="ebook"
        productDetail={ebookData}
        productEpisode={episode_ebooks}
        isLoading={isLoading}
        handlePayment={handleModalOpen}
        handleSubscribe={handleModalSubscribeOpen}
        topContentData={data?.topContent || []}
        recomendationData={data?.recommendation || []}
      />
      <SimpleModal
        title={"Konten ini masih terkunci, apakah kamu bersedia membeli nya dengan harga Rp. " + (selectedPrice?.toLocaleString() ?? 0) + ",- ?"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleBuy}
      />
      <SimpleModal
        title={"Subscribe untuk menikmati seluruh episode dari konten ini selama sebulan seharga Rp. " + (selectedPrice?.toLocaleString() ?? 0) + ",- ?"}
        isOpen={isModalSubscribeOpen}
        onClose={() => setIsModalSubscribeOpen(false)}
        onConfirm={handleSubscribe}
      />
      {loading && <LoadingOverlay />}
    </div>
  );
}
