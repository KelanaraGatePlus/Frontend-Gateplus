"use client";
import React, { use } from "react";
import { useState, useEffect } from 'react';

/*[--- COMPONENT IMPORT ---]*/
import MainTemplateLayout from "@/components/MainDetailProduct/page";
import { useGetUserId } from "@/lib/features/useGetUserId";

/*[--- API HOOKS ---]*/
import { useGetEbookByIdQuery } from "@/hooks/api/ebookSliceAPI";
import SimpleModal from "@/components/Modal/SimpleModal";
import { useMidtransPayment } from "@/hooks/api/midtransAPI";
import LoadingOverlay from "@/components/LoadingOverlay/page";

// eslint-disable-next-line react/prop-types
export default function DetailEbookPage({ params }) {
  const { id } = React.use(params);
  const userId = useGetUserId();
  const [loading, setLoading] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedCreatorId, setSelectedCreatorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const {pay, snapReady} = useMidtransPayment();

  const handleModalOpen = (creatorId, episodeId, price) => {
    setSelectedCreatorId(creatorId);
    setSelectedEpisode(episodeId);
    setSelectedPrice(price);
    setIsModalOpen(true);
  }

  const handleBuy = async () => {
    setLoading(true);
    await pay({
      creatorId: selectedCreatorId,
      episodeId: selectedEpisode,
      price: selectedPrice,
      contentType: "EBOOK",
    });
    setIsModalOpen(false);
    setLoading(false);
  };

  const skip = !id || !userId;
  const { data, isLoading } = useGetEbookByIdQuery({ id, userId }, { skip });
  const ebookData = data?.data?.data || {};
  const episode_ebooks = (ebookData.episode_ebooks || []).slice().sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  return (
    <div>
      <MainTemplateLayout
        productType="ebook"
        productDetail={ebookData}
        productEpisode={episode_ebooks}
        isLoading={isLoading}
        handlePayment={handleModalOpen}
      />
      <SimpleModal
        title={"Konten ini masih terkunci, apakah kamu bersedia membeli nya dengan harga Rp. " + (selectedPrice?.toLocaleString() ?? 0) + ",- ?"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleBuy}
      />
      {loading && <LoadingOverlay />}
    </div>
  );
}
