"use client";
import React, { useState } from "react";

import MainTemplateLayout from "@/components/template/page";

export default function DetailPodcast() {
  const [podcastData] = useState({
    id: "podcst0001xyz",
    creatorId: "user-9a8b7c6d-1234-5678-abcd-efgh9876ijkl",
    categoriesId: "catg-talkcomedy123",
    title: "Ngopi Tengah Malam: Episode 1 - Ketika Mie Instan Bicara",
    description:
      "Sebuah podcast receh penuh obrolan absurd di tengah malam, ditemani suara jangkrik dan mie yang overcook.",
    language: "Indonesia",
    ageRestriction: "SU",
    coverImageUrl: "https://picsum.photos/seed/poster/600/900",
    posterImageUrl: "https://picsum.photos/800/450",
    createdAt: "2025-06-10T21:15:00.000Z",
    updatedAt: "2025-06-10T21:15:00.000Z",
    categories: {
      tittle: "Talkshow & Komedi",
    },
    episode_podcasts: [
      {
        id: "dummy",
        podcastId: "cmbhdggt00005jwzkz3znfaj9",
        creatorId: "4d88a00f-23da-4856-8f01-c6aefb882d76",
        title: "Episode 1",
        description:
          "Ngobrol santai tentang hal-hal kecil yang ternyata punya dampak besar di hidup.",
        price: "10000",
        views: 5,
        coverEpisodeUrl: "https://picsum.photos/800/450?grayscale&blur=2",
        notedEpisode: "Justru Itu",
        createdAt: "2025-06-04T03:13:22.004Z",
        updatedAt: "2025-06-17T12:34:03.908Z",
      },
      {
        id: "dummy",
        podcastId: "cmbhdggt00005jwzkz3znfaj9",
        creatorId: "4d88a00f-23da-4856-8f01-c6aefb882d76",
        title: "Episode 2",
        description:
          "Kita bahas kenapa overthinking bisa muncul bahkan dari chat 'oke'.",
        price: "10000",
        views: 8,
        coverEpisodeUrl: "https://picsum.photos/seed/eps2/800/450",
        notedEpisode: "Relatable banget",
        createdAt: "2025-06-05T08:21:12.431Z",
        updatedAt: "2025-06-17T12:34:03.908Z",
      },
      {
        id: "dummy",
        podcastId: "cmbhdggt00005jwzkz3znfaj9",
        creatorId: "4d88a00f-23da-4856-8f01-c6aefb882d76",
        title: "Episode 3",
        description:
          "Kisah gagal move on yang akhirnya jadi pelajaran berharga. Siap-siap baper.",
        price: "10000",
        views: 12,
        coverEpisodeUrl: "https://picsum.photos/seed/eps3/800/450",
        notedEpisode: "Mantan siapa nih?",
        createdAt: "2025-06-06T10:09:45.100Z",
        updatedAt: "2025-06-17T12:34:03.908Z",
      },
      {
        id: "dummy",
        podcastId: "cmbhdggt00005jwzkz3znfaj9",
        creatorId: "4d88a00f-23da-4856-8f01-c6aefb882d76",
        title: "Episode 4",
        description:
          "Tentang mimpi masa kecil yang ternyata masih relevan banget buat hari ini.",
        price: "10000",
        views: 3,
        coverEpisodeUrl: "https://picsum.photos/seed/eps4/800/450",
        notedEpisode: "Throwback vibes",
        createdAt: "2025-06-07T12:15:33.900Z",
        updatedAt: "2025-06-17T12:34:03.908Z",
      },
      {
        id: "dummy",
        podcastId: "cmbhdggt00005jwzkz3znfaj9",
        creatorId: "4d88a00f-23da-4856-8f01-c6aefb882d76",
        title: "Episode 5",
        description:
          "Dari burnout jadi break, dari break jadi bangkit. Cerita soal self-reset.",
        price: "10000",
        views: 9,
        coverEpisodeUrl: "https://picsum.photos/seed/eps5/800/450",
        notedEpisode: "Capek tapi nggak nyerah",
        createdAt: "2025-06-08T15:48:20.532Z",
        updatedAt: "2025-06-17T12:34:03.908Z",
      },
      {
        id: "dummy",
        podcastId: "cmbhdggt00005jwzkz3znfaj9",
        creatorId: "4d88a00f-23da-4856-8f01-c6aefb882d76",
        title: "Episode 6",
        description:
          "Obrolan tentang rasa cukup di tengah dunia yang selalu minta lebih.",
        price: "10000",
        views: 7,
        coverEpisodeUrl: "https://picsum.photos/seed/eps6/800/450",
        notedEpisode: "Kunci tenang itu syukur",
        createdAt: "2025-06-09T18:27:51.823Z",
        updatedAt: "2025-06-17T12:34:03.908Z",
      },
    ],
    creators: {
      id: "user-9a8b7c6d-1234-5678-abcd-efgh9876ijkl",
      userId: "u123-bayufadayan",
      profileName: "Kopi Senja Official",
      username: "kopisenja",
      email: "kopisenja@email.com",
      phone: "085712345678",
      gender: "Male",
      dateOfBirth: "1998-03-14",
      region: "Bandung",
      description:
        "Podcast obrolan receh tengah malam yang nggak akan mengubah hidupmu, tapi bisa nemenin kamu galau.",
      role: "Creators",
      isVerified: true,
      bannerImageUrl:
        "https://images.unsplash.com/photo-1523475496153-3c0f48f9e98c?auto=format&fit=crop&w=1350&q=80",
      imageUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=687&q=80",
      instagramUrl: "https://instagram.com/kopisenja",
      tiktokUrl: "https://tiktok.com/@kopisenja",
      twitterUrl: "https://twitter.com/kopisenja",
      facebookUrl: "https://facebook.com/kopisenja",
      createdAt: "2025-05-01T12:00:00.000Z",
      updatedAt: "2025-06-10T20:00:00.000Z",
      subscriptions: [],
    },
    savedBy: [],
    like: [],
    isSubscribed: false,
    isLiked: false,
    isSaved: false,
    totalCount: 9328475,
    totalLikes: 453,
    totalViews: 134,
  });

  return (
    podcastData && (
      <MainTemplateLayout
        productType="podcast"
        productDetail={podcastData}
        productEpisode={podcastData.episode_podcasts}
      />
    )
  );
}
