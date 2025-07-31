"use client";
import React, { use } from "react";
import { useState, useEffect } from 'react';

/*[--- COMPONENT IMPORT ---]*/
import MainTemplateLayout from "@/components/MainDetailProduct/page";
import { useGetUserId } from "@/lib/features/useGetUserId";

/*[--- API HOOKS ---]*/
import { useGetEbookByIdQuery } from "@/hooks/api/ebookSliceAPI";
import { BACKEND_URL } from "@/lib/constants/backendUrl";
import SimpleModal from "@/components/Modal/SimpleModal";

// eslint-disable-next-line react/prop-types
export default function DetailEbookPage({ params }) {
  const { id } = use(params);
  const userId = useGetUserId();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [snapReady, setSnapReady] = useState(false); // ⬅️ Tambahan: cek Snap.js sudah siap
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedCreatorId, setSelectedCreatorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);

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
          contentType: 'EBOOK',
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
        onConfirm={handlePayment}
      />
    </div>
  );
}
