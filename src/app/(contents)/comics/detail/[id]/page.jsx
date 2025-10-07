"use client";
import React from "react";
import { use, useEffect, useState } from "react";
import PropTypes from "prop-types";

/*[--- API HOOKS ---]*/
import { useGetComicByIdQuery } from "@/hooks/api/comicSliceAPI";

/*[--- UI COMPONENTS ---]*/
import MainTemplateLayout from "@/components/MainDetailProduct/page";
import SimpleModal from "@/components/Modal/SimpleModal";
import { useMidtransPayment } from "@/hooks/api/midtransAPI";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";

export default function DetailComicPage({ params }) {
  const { id } = use(params);
  const [userId, setUserId] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedCreatorId, setSelectedCreatorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const { pay } = useMidtransPayment();
  const { pay: subscribePay } = useMidtransPayment("SUBSCRIBE");
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [isModalSubscribeOpen, setIsModalSubscribeOpen] = useState(false);
  const [createLog] = useCreateLogMutation();

  const handleModalSubscribeOpen = (creatorId, contentId, price) => {
    setSelectedCreatorId(creatorId);
    setSelectedContentId(contentId);
    setSelectedPrice(price);
    setIsModalSubscribeOpen(true);
  };

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
      contentType: "COMIC",
    });
    setIsModalOpen(false);
    setLoading(false);
  };

  const handleSubscribe = async () => {
    setLoading(true);
    await subscribePay({
      creatorId: selectedCreatorId,
      contentId: selectedContentId,
      price: selectedPrice,
      contentType: "COMIC",
    });
    setIsModalSubscribeOpen(false);
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("users_id");
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    createLog({
      contentType: "COMIC",
      logType: "CLICK",        // atau WATCH_TRAILER / WATCH_CONTENT sesuai kebutuhan
      contentId: id,
    });
  }, [id, createLog]);

  const skip = !id || !userId;
  const { data, isLoading } = useGetComicByIdQuery({ id, userId }, { skip });
  const comicData = data?.data?.data || {};
  const episode_comics = (comicData.episode_comics || []).slice().sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
  const topContent = data?.data?.topContent || [];
  const recommendedContent = data?.data?.recommendation || [];

  return (
    comicData && (
      <div>
        <MainTemplateLayout
          productType="comic"
          productDetail={comicData}
          productEpisode={episode_comics}
          isLoading={isLoading}
          handlePayment={handleModalOpen}
          handleSubscribe={handleModalSubscribeOpen}
          topContentData={topContent}
          recomendationData={recommendedContent}
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
    )
  );
}

DetailComicPage.propTypes = {
  params: PropTypes.string,
}