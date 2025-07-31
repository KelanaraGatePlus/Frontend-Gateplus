"use client";
import React from "react";
import { use, useEffect, useState } from "react";
import PropTypes from "prop-types";

/*[--- API HOOKS ---]*/
import { useGetComicByIdQuery } from "@/hooks/api/comicSliceAPI";

/*[--- UI COMPONENTS ---]*/
import MainTemplateLayout from "@/components/MainDetailProduct/page";
import SimpleModal from "@/components/Modal/SimpleModal";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export default function DetailComicPage({ params }) {
  const { id } = use(params);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState('');
  const [snapReady, setSnapReady] = useState(false); // ⬅️ Tambahan: cek Snap.js sudah siap
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedCreatorId, setSelectedCreatorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ambil user ID dan token dari localStorage
    const storedToken = localStorage.getItem('token');

    if (storedToken) setToken(storedToken);
    else console.error('Token not found in localStorage');
  }, []);

  // ⬇️ Load Midtrans Snap secara manual (reliable)
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute('data-client-key', 'SB-Mid-client-w_nX8byQy-u4QRfl');
    script.async = true;
    script.onload = () => {
      console.log("Midtrans Snap loaded");
      setSnapReady(true);
    };
    script.onerror = () => {
      console.error("Failed to load Midtrans Snap.js");
    };
    document.body.appendChild(script);
  }, []);

  const handleModalOpen = (creatorId, episodeId, price) => {
    setSelectedCreatorId(creatorId);
    setSelectedEpisode(episodeId);
    setSelectedPrice(price);
    setIsModalOpen(true);
  }

  const handlePayment = async () => {
    setIsModalOpen(false);
    if (!snapReady || !window.snap) {
      alert("Midtrans Snap belum siap. Coba lagi beberapa detik lagi.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/payment/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorId: selectedCreatorId,
          episodeId: selectedEpisode,
          contentType: 'COMIC',
          price: selectedPrice,
        }),
      });

      const data = await res.json();

      if (!data.snapToken) {
        throw new Error("snapToken tidak ditemukan.");
      }

      window.snap.pay(data.snapToken, {
        onSuccess: function (result) {
          console.log('Success', result);
        },
        onPending: function (result) {
          console.log('Pending', result);
          alert('Pembayaran masih pending.');
        },
        onError: function (result) {
          console.error('Error', result);
          alert('Pembayaran gagal.');
        },
        onClose: function () {
          alert('Popup ditutup tanpa menyelesaikan pembayaran.');
        },
      });
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Gagal membuat transaksi.');
    } finally {
      setLoading(false);
    }
  };

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
      <div>
        <MainTemplateLayout
          productType="comic"
          productDetail={comicData}
          productEpisode={episode_comics}
          isLoading={isLoading}
          handlePayment={handleModalOpen}
        />
        <SimpleModal
          title={"Konten ini masih terkunci, apakah kamu bersedia membeli nya dengan harga Rp. " + (selectedPrice?.toLocaleString() ?? 0) + ",- ?"}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handlePayment}
        />
      </div>
    )
  );
}

DetailComicPage.propTypes = {
  params: PropTypes.string,
}