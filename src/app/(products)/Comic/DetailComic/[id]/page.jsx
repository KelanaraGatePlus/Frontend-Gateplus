/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
"use client";

import CarouselItemEookPage from "@/components/CarouselEbook/page";
import Footer from "@/components/Footer/page";
import Navbar from "@/components/Navbar/page";
import ShareModal from "@/components/ShareModal/page";
import Toast from "@/components/Toast/page";
import { Suspense } from "react";
import iconMoreMenuComment from "@@/icons/icon-comment.svg";
import BackPage from "@/components/BackPage/page";
import logoUsersComment from "@@/icons/logo-users-comment.svg";
import iconsUnlocked from "@@/icons/icons-unlocked.svg";
import iconsLocked from "@@/icons/icons-locked.svg";
import logoArrowDown from "@@/logo/logoDetailEbook/icon-arrow-down.svg";
import IconsDislikeComment from "@@/logo/logoDetailEbook/icon-dislike-comment.svg";
import IconsDropdownComment from "@@/logo/logoDetailEbook/icon-dropdown-comment.svg";
import IconsLikeComment from "@@/logo/logoDetailEbook/icon-like-comment.svg";
import logoDislike from "@@/logo/logoDetailFilm/dislike-icons.svg";
import logoLike from "@@/logo/logoDetailFilm/like-icons.svg";
import logoLiked from "@@/logo/logoDetailFilm/liked-icons.svg";
import logoSave from "@@/logo/logoDetailFilm/save-icons.svg";
import logoSaved from "@@/logo/logoDetailFilm/saved-icons.svg";
import logoShare from "@@/logo/logoDetailFilm/share-icons.svg";
import logoSubscribe from "@@/logo/logoDetailFilm/subscribe-icon-kelanara.svg";
import axios from "axios";
import { Zain } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import ViewsIcon from "@@/icons/views-icon.svg";
import { use, useEffect, useState } from "react";
import { formatFollowersCount } from "@/lib/followersCount";
import { formatDateTime } from "@/lib/timeFormatter";

const zain = Zain({
  variable: "--font-zain",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  weight: ["200", "400", "700", "800"],
});

// const dummyEbookList = [
//   {
//     id: 1,
//     title: "LAUT BERCERITA : Sebuah Novel Oleh Leila S. Chudori",
//     poster: PosterEbookLautBercerita,
//     description:
//       "Racun Sangga: Santet Pemisah Rumah Tangga adalah sebuah film horor Indonesia tahun 2024 yang disutradarai oleh Rizal Mantovani diproduksi Soraya Intercine Films. Film tersebut diangkat dari sebuah utas viral karya Gusti Gina yang juga bertindak sebagai penulis skenario.",
//     date: "17 Apr 2025",
//   },
//   {
//     id: 2,
//     title: "LAUT BERCERITA : Sebuah Novel Oleh Leila S. Chudori",
//     poster: PosterEbookLautBercerita,
//     description:
//       "Racun Sangga: Santet Pemisah Rumah Tangga adalah sebuah film horor Indonesia tahun 2024 yang disutradarai oleh Rizal Mantovani diproduksi Soraya Intercine Films. Film tersebut diangkat dari sebuah utas viral karya Gusti Gina yang juga bertindak sebagai penulis skenario.",
//     date: "17 Apr 2025",
//   },
//   {
//     id: 3,
//     title: "LAUT BERCERITA : Sebuah Novel Oleh Leila S. Chudori",
//     poster: PosterEbookLautBercerita,
//     description:
//       "Racun Sangga: Santet Pemisah Rumah Tangga adalah sebuah film horor Indonesia tahun 2024 yang disutradarai oleh Rizal Mantovani diproduksi Soraya Intercine Films. Film tersebut diangkat dari sebuah utas viral karya Gusti Gina yang juga bertindak sebagai penulis skenario.",
//     date: "17 Apr 2025",
//   },
//   {
//     id: 4,
//     title: "LAUT BERCERITA : Sebuah Novel Oleh Leila S. Chudori",
//     poster: PosterEbookLautBercerita,
//     description:
//       "Racun Sangga: Santet Pemisah Rumah Tangga adalah sebuah film horor Indonesia tahun 2024 yang disutradarai oleh Rizal Mantovani diproduksi Soraya Intercine Films. Film tersebut diangkat dari sebuah utas viral karya Gusti Gina yang juga bertindak sebagai penulis skenario.",
//     date: "17 Apr 2025",
//   },
//   {
//     id: 5,
//     title: "LAUT BERCERITA : Sebuah Novel Oleh Leila S. Chudori",
//     poster: PosterEbookLautBercerita,
//     description:
//       "Racun Sangga: Santet Pemisah Rumah Tangga adalah sebuah film horor Indonesia tahun 2024 yang disutradarai oleh Rizal Mantovani diproduksi Soraya Intercine Films. Film tersebut diangkat dari sebuah utas viral karya Gusti Gina yang juga bertindak sebagai penulis skenario.",
//     date: "17 Apr 2025",
//   },
//   {
//     id: 6,
//     title: "LAUT BERCERITA : Sebuah Novel Oleh Leila S. Chudori",
//     poster: PosterEbookLautBercerita,
//     description:
//       "Racun Sangga: Santet Pemisah Rumah Tangga adalah sebuah film horor Indonesia tahun 2024 yang disutradarai oleh Rizal Mantovani diproduksi Soraya Intercine Films. Film tersebut diangkat dari sebuah utas viral karya Gusti Gina yang juga bertindak sebagai penulis skenario.",
//     date: "17 Apr 2025",
//   },
//   {
//     id: 7,
//     title: "LAUT BERCERITA : Sebuah Novel Oleh Leila S. Chudori",
//     poster: PosterEbookLautBercerita,
//     description:
//       "Racun Sangga: Santet Pemisah Rumah Tangga adalah sebuah film horor Indonesia tahun 2024 yang disutradarai oleh Rizal Mantovani diproduksi Soraya Intercine Films. Film tersebut diangkat dari sebuah utas viral karya Gusti Gina yang juga bertindak sebagai penulis skenario.",
//     date: "17 Apr 2025",
//   },
//   {
//     id: 8,
//     title: "LAUT BERCERITA : Sebuah Novel Oleh Leila S. Chudori",
//     poster: PosterEbookLautBercerita,
//     description:
//       "Racun Sangga: Santet Pemisah Rumah Tangga adalah sebuah film horor Indonesia tahun 2024 yang disutradarai oleh Rizal Mantovani diproduksi Soraya Intercine Films. Film tersebut diangkat dari sebuah utas viral karya Gusti Gina yang juga bertindak sebagai penulis skenario.",
//     date: "17 Apr 2025",
//   },
//   {
//     id: 9,
//     title: "LAUT BERCERITA : Sebuah Novel Oleh Leila S. Chudori",
//     poster: PosterEbookLautBercerita,
//     description:
//       "Racun Sangga: Santet Pemisah Rumah Tangga adalah sebuah film horor Indonesia tahun 2024 yang disutradarai oleh Rizal Mantovani diproduksi Soraya Intercine Films. Film tersebut diangkat dari sebuah utas viral karya Gusti Gina yang juga bertindak sebagai penulis skenario.",
//     date: "17 Apr 2025",
//   },
//   {
//     id: 10,
//     title: "LAUT BERCERITA : Sebuah Novel Oleh Leila S. Chudori",
//     poster: PosterEbookLautBercerita,
//     description:
//       "Racun Sangga: Santet Pemisah Rumah Tangga adalah sebuah film horor Indonesia tahun 2024 yang disutradarai oleh Rizal Mantovani diproduksi Soraya Intercine Films. Film tersebut diangkat dari sebuah utas viral karya Gusti Gina yang juga bertindak sebagai penulis skenario.",
//     date: "17 Apr 2025",
//   },
// ];

// eslint-disable-next-line react/prop-types
export default function DetailEbook({ params }) {
  const { id } = use(params);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [ageRestriction, setAgeRestriction] = useState("");
  const [language, setLanguage] = useState("");
  const [posterBannerUrl, setPosterBannerUrl] = useState("");
  const [coverBookUrl, setCoverBookUrl] = useState("");
  const [creatorProfileName, setCreatorProfileName] = useState("");
  const [creatorUsername, setCreatorUsername] = useState("");
  const [creatorImageUrl, setCreatorImageUrl] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [totalSubs, setTotalSubs] = useState("0");
  const [totalLike, setTotalLike] = useState("0");
  const [totalView, setTotalView] = useState("0");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isOwnChannel, setIsOwnChannel] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isCommentAvailable, setIsCommentAvailable] = useState(false);
  const [episodeComics, setEpisodeComics] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  const getData = async () => {
    try {
      const userId = localStorage.getItem("users_id");
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://backend-gateplus-api.my.id/comics/${id}?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const comicSingleData = response.data.data.data;

      setTitle(comicSingleData.title);
      setDescription(comicSingleData.description);
      setGenre(comicSingleData.categories.tittle);
      setAgeRestriction(comicSingleData.ageRestriction);
      setPosterBannerUrl(comicSingleData.posterImageUrl);
      setCoverBookUrl(comicSingleData.coverImageUrl);
      setLanguage(comicSingleData.language);
      setEpisodeComics(comicSingleData.episode_comics);

      const creatorData = comicSingleData.creators;
      setCreatorId(creatorData.id);
      setCreatorProfileName(creatorData.profileName);
      setCreatorUsername(creatorData.username);
      setCreatorImageUrl(creatorData.imageUrl);

      setIsSubscribed(comicSingleData.isSubscribed);
      setTotalSubs(comicSingleData.totalCount);
      setTotalView(comicSingleData.totalViews);

      const creatorIdLocal = localStorage.getItem("creators_id");
      if (creatorIdLocal === creatorData.id) {
        setIsOwnChannel(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const handleToggleLike = async () => {
  //     if (isLiked) {
  //         setShowToast(true);
  //         setShowToast(true);
  //         setToastMessage(`Untuk saat ini belum bisa UnLike Ebook ${title}`);
  //         setToastType("failed");
  //         return null;
  //     }
  //     try {
  //         setIsLiked(true);
  //         const userId = localStorage.getItem("users_id");
  //         console.log(userId);
  //         const response = await axios.post(
  //             `https://backend-gateplus-api.my.id/like`,
  //             {
  //                 userId: userId,
  //                 ebookId: id,
  //             },
  //         );
  //         setTotalLike(totalLike + 1);
  //         console.log(response.data);
  //     } catch (error) {
  //         console.error(error);
  //     }
  // };

  // const handleToggleSave = async () => {
  //     if (isSaved) {
  //         setShowToast(true);
  //         setShowToast(true);
  //         setToastMessage(`Untuk saat ini belum bisa Unsave Ebook ${title}`);
  //         setToastType("failed");
  //         return null;
  //     }
  //     try {
  //         setIsSaved(true);
  //         const userId = localStorage.getItem("users_id");
  //         console.log(userId);
  //         const response = await axios.post(
  //             `https://backend-gateplus-api.my.id/save`,
  //             {
  //                 userId: userId,
  //                 ebookId: id,
  //             },
  //         );
  //         console.log(response.data);
  //         setShowToast(true);
  //         setToastMessage(`Berhasil Save Ebook ${title}`);
  //         setToastType("success");
  //     } catch (error) {
  //         console.error(error);
  //     }
  // };

  const handleFeaturedOnProgress = () => {
    setShowToast(true);
    setShowToast(true);
    setToastMessage(`Fitur ini belum tersedia di komik`);
    setToastType("failed");
    return null;
  };

  const handleToggleSubscribe = async () => {
    if (isSubscribed) {
      setShowToast(true);
      setToastMessage(
        `Untuk saat ini belum bisa Unsubscribe Creator ${creatorProfileName}`,
      );
      setToastType("failed");
      return null;
    }
    try {
      setIsSubscribing(true);
      const userId = localStorage.getItem("users_id");
      console.log(userId);
      console.log(creatorId);
      const response = await axios.post(
        `https://backend-gateplus-api.my.id/subscribers`,
        {
          userId: userId,
          creatorId: creatorId,
        },
      );
      setTotalSubs(totalSubs + 1);
      console.log(response.data);
      setIsSubscribed(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubscribing(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const [showAll, setShowAll] = useState(false);
  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="flex flex-col overflow-x-hidden">
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
      </Suspense>

      <main className="mt-16 flex flex-col md:mt-[100px]">
        {/* Bagian Header */}
        <section className="relative w-full">
          {/* banner */}
          <div className="absolute -z-10 h-64 w-full overflow-hidden">
            {posterBannerUrl && (
              <Image
                src={posterBannerUrl}
                alt="Poster"
                fill
                className="object-cover"
              />
            )}
            <div className="absolute top-0 left-0 z-0 h-full w-full bg-[linear-gradient(to_bottom,_#FFFFFF00,_#FFFFFF00,_#FFFFFF00,_#FFFFFF00,_#737373A1,_#595959BF,_#3F3F3FDE,_#303030ED,_#222222FF)]" />
          </div>

          {/* Back menu */}
          <BackPage />

          {/* container content */}
          <div className="flex w-screen flex-col items-center gap-4 px-4 py-8 md:px-15 lg:flex-row">
            {/* cover buku */}
            <div className="relative h-[300px] w-[200px] overflow-hidden rounded-lg md:h-[500px] md:w-[337px] md:rounded">
              {coverBookUrl && (
                <Image
                  src={coverBookUrl}
                  alt="Poster"
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* judl genre */}
            <div className="flex w-full max-w-full flex-1 flex-col justify-end gap-4 self-end text-white">
              {/* judul dan durasi */}
              <div>
                <h1
                  className={`${zain.className} text-center text-3xl font-extrabold md:text-4xl lg:text-left`}
                >
                  {title}
                </h1>
                <div className="flex items-center justify-center gap-1 text-sm font-light lg:justify-start">
                  <div className="flex h-4 items-center justify-start gap-1">
                    <Image
                      src={ViewsIcon}
                      alt="views-icon"
                      width={20}
                      height={20}
                      className="object-cover opacity-70"
                      priority
                    />
                    <p>{totalView}</p>
                  </div>
                  <p>|</p>
                  <div className="flex h-4 items-center justify-start gap-1">
                    {ageRestriction}
                  </div>
                  <p>|</p>
                  <div className="flex h-4 items-center justify-start gap-1">
                    {genre}
                  </div>
                </div>
              </div>

              {/* action button */}
              <div className="flex w-fit justify-center gap-2 self-center md:justify-start lg:self-auto">
                <div className="flex w-fit flex-1 items-center justify-center md:flex-none">
                  {episodeComics[0] ? (
                    <Link href={`/Comic/ReadComic/${episodeComics[0].id}`}>
                      <button className="w-full cursor-pointer rounded-3xl bg-[#0076E999] px-12 py-3 font-bold text-white hover:bg-[#0076E999]/80 md:w-auto">
                        Baca
                      </button>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full cursor-not-allowed rounded-3xl bg-gray-400 px-12 py-3 font-bold text-white md:w-auto"
                    >
                      Belum Ada
                    </button>
                  )}
                </div>
                <div
                  className={`flex cursor-pointer items-center justify-center gap-1 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ${
                    isLiked ? "animate-like" : ""
                  }`}
                  onClick={handleFeaturedOnProgress}
                >
                  {isLiked ? (
                    <Image
                      priority
                      className="focus-within:bg-purple-300"
                      width={35}
                      alt="logo-like"
                      src={logoLiked}
                    />
                  ) : (
                    <Image
                      priority
                      className="focus-within:bg-purple-300"
                      width={35}
                      alt="logo-like"
                      src={logoLike}
                    />
                  )}
                  <p className="montserratFont mt-1 text-base font-bold">
                    {totalLike}
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <Image
                    priority
                    width={35}
                    alt="logo-dislike"
                    src={logoDislike}
                  />
                </div>
                <div
                  className={`flex cursor-pointer items-center justify-center transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ${isSaved ? "animate-like" : ""}`}
                  onClick={handleFeaturedOnProgress}
                >
                  {isSaved ? (
                    <Image
                      priority
                      width={35}
                      alt="logo-saved"
                      src={logoSaved}
                    />
                  ) : (
                    <Image priority width={35} alt="logo-save" src={logoSave} />
                  )}
                </div>
                <div
                  className="flex cursor-pointer items-center justify-center transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                  onClick={() => setShowShareModal(true)}
                >
                  <Image priority width={35} alt="logo-share" src={logoShare} />
                </div>
              </div>

              {/* uploader */}
              <div className="flex items-center gap-2">
                <Link href={`/Creators/${creatorId}`}>
                  <div className="h-15 w-15 rounded-full bg-white">
                    <Image
                      priority
                      src={creatorImageUrl || logoSubscribe}
                      alt="logo-subscribers"
                      width={100}
                      height={100}
                      className="h-full w-full rounded-full object-cover object-center"
                    />
                  </div>
                </Link>

                <div className="flex flex-row items-center gap-4">
                  <Link href={`/Creators/${creatorId}`}>
                    <div className="group flex max-w-36 cursor-pointer flex-col rounded-lg text-ellipsis whitespace-nowrap md:max-w-72">
                      <h3
                        className={`${zain.className} truncate text-2xl font-extrabold group-hover:text-blue-400 group-hover:underline md:text-3xl ${!creatorProfileName ? "text-gray-600/60 italic" : ""}`}
                      >
                        {creatorProfileName || "Nama Channel belum diatur"}
                      </h3>
                      <p className="-mt-1 text-[10px] font-light md:text-sm">
                        {formatFollowersCount(totalSubs)} Followers
                      </p>
                    </div>
                  </Link>
                  {!isOwnChannel && (
                    <button
                      className={`zeinFont mt-1 flex cursor-pointer items-center justify-center rounded-full ${!isSubscribed ? "bg-blue-800 hover:bg-blue-900" : "bg-gray-600 hover:bg-gray-700"} px-5 pt-1.5 pb-1 text-xl`}
                      onClick={handleToggleSubscribe}
                    >
                      {isSubscribing ? (
                        <div className="flex">
                          <svg
                            aria-hidden="true"
                            className="dark:text-white-600 mr-2 h-6 w-6 animate-spin fill-white text-gray-200"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <p className="flex">Subscribing...</p>
                        </div>
                      ) : isSubscribed ? (
                        "Subscribed"
                      ) : (
                        "Subscribe Now"
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* description */}
              <div className="flex w-full max-w-full flex-col gap-6 rounded-lg bg-[#393939] p-2 text-base font-normal">
                <p>{description}</p>
                <p>
                  Judul : {title} <br />
                  Penulis Cerita : {creatorUsername} <br />
                  Genre : {genre} <br />
                  Bahasa : {language} <br />
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bagian Episode */}
        {episodeComics.length > 0 ? (
          <section className="relative flex w-screen flex-col py-5 text-white">
            {/* Lihat episode pertama */}
            <div className="flex px-4 md:px-15">
              <div className="mb-1 flex w-full items-center justify-center gap-2 rounded-lg bg-[#393939] py-2">
                <h4 className={`${zain.className} text-2xl font-bold`}>
                  Lihat Episode Pertama
                </h4>
                <div className="flex h-8 w-8 items-center justify-center">
                  <Image
                    priority
                    width={35}
                    alt="logo-arrow-down"
                    src={logoArrowDown}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* List episode */}
            {(showAll ? episodeComics : episodeComics.slice(0, 5)).map(
              (item, index) => (
                <Link key={item.id} href={`/Comic/ReadComic/${item.id}`}>
                  <div className="group flex cursor-pointer items-stretch gap-2 px-4 py-2 hover:bg-[#1F6E8A] md:gap-4 md:px-15">
                    {/* Book Container */}
                    <div className="h-24 w-24 overflow-hidden rounded-lg md:h-36 md:w-36">
                      <Image
                        priority
                        src={item.coverEpisodeUrl}
                        alt={`poster-${item.title}`}
                        className="h-full w-full rounded object-cover object-center"
                        width={144}
                        height={144}
                      />
                    </div>

                    {/* Description */}
                    <div className="flex flex-1 flex-col items-stretch justify-between rounded-lg bg-[#393939] p-2 group-hover:bg-[#21414C]">
                      <div className="flex flex-col">
                        <div className="flex flex-col-reverse items-start justify-start sm:flex-row sm:justify-between">
                          <h4
                            className={`w-fit ${zain.className} my-2 [display:-webkit-box] overflow-hidden text-xl leading-5 font-extrabold text-ellipsis [-webkit-box-orient:vertical] [-webkit-line-clamp:2] md:text-2xl`}
                          >
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xl font-extrabold md:mr-2">
                            <div className="rounded border-2 border-[#F5F5F524] bg-[#F5F5F524] p-1">
                              <Image
                                priority
                                src={isLocked ? iconsLocked : iconsUnlocked}
                                alt={`poster-${item.title}`}
                                className="h-full w-full rounded object-cover object-center"
                                width={16}
                                height={16}
                              />
                            </div>
                            <div className="rounded border-2 border-[#F5F5F524] bg-[#F5F5F524] p-1 text-xs font-semibold">
                              Rp. {item.price}
                            </div>
                            <h4
                              className={`w-fit ${zain.className} mt-1 [display:-webkit-box] overflow-hidden text-xl font-extrabold text-ellipsis [-webkit-box-orient:vertical] [-webkit-line-clamp:2] md:text-2xl`}
                            >{`# ${index + 1}`}</h4>
                          </div>
                        </div>
                        <p className="hidden text-sm font-normal md:block">
                          {item.description}
                        </p>
                      </div>
                      <p className="text-[10px] font-normal md:text-sm">
                        {formatDateTime(item.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ),
            )}

            {/* Lihat Lainnya */}
            {episodeComics.length > 5 && (
              <div
                className={`absolute left-0 flex w-screen items-end py-2 ${showAll ? "bottom-[-45px] h-fit" : "bottom-0 h-45 bg-gradient-to-b from-[#39393900] via-[#393939CC] to-[#393939FF]"}`}
              >
                <div
                  className="group flex w-screen cursor-pointer justify-center hover:text-blue-500"
                  onClick={handleShowAll}
                >
                  <p className={`${zain.className} text-2xl font-extrabold`}>
                    {showAll ? "Lihat Lebih Sedikit" : "Lihat Lainnya"}
                  </p>
                </div>
              </div>
            )}
          </section>
        ) : (
          <div className="px-14">
            <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#393939] py-4">
              <h4
                className={`${zain.className} text-xl font-semibold text-white md:text-2xl`}
              >
                Belum Ada Episode Tersedia
              </h4>
            </div>
          </div>
        )}
        {/* Carousel Rekomendation */}
        <CarouselItemEookPage />

        {/* SawerKuy */}
        <section className="relative flex w-screen flex-col px-4 py-5 text-white md:px-15">
          <div className="w-full rounded-xl bg-[#2f2f2f] p-4 text-white">
            <h3 className="mb-2 text-xl font-bold lg:text-2xl">Sawerkuy!</h3>
            <p className="mb-2 text-justify text-sm lg:text-base">
              Karya ini bisa dinikmati secara gratis, tapi kalau kamu mau, kasih
              &quot;sawer&quot; ke kreator. Dengan donasi, kamu udah bantu
              kreator supaya terus bisa berkarya, kayak hero di dunia anime!
            </p>
            <p className="mb-4 text-justify text-sm lg:text-base">
              Karya ini GRATIS! Tapi kamu boleh kok kasih tip biar kreator hepi
              🥰
            </p>

            <div className="mb-2 grid grid-cols-4 gap-2">
              <button
                type="button"
                className="flex-1 rounded-lg bg-[#175BA6] py-2 text-lg font-bold text-white"
              >
                5K
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg bg-[#175BA6] py-2 text-lg font-bold text-white"
              >
                10k
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg bg-[#175BA6] py-2 text-lg font-bold text-white"
              >
                25k
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg bg-[#175BA6] py-2 text-lg font-bold text-white"
              >
                75k
              </button>
            </div>
            <button
              type="submit"
              className="w-full flex-1 rounded-lg bg-[#175BA6] py-3 text-lg font-bold text-white lg:py-2"
            >
              Masukan Nominal Sendiri
            </button>
          </div>

          <p className="mt-6 text-center text-base">
            Gimana nih? Apakah konten ini melanggar{" "}
            <Link href="/" className="underline">
              aturan (Syarat & Ketentuan)
            </Link>
            ? Laporkan aja kalau ada yang nggak sesuai ya!{" "}
            <Link href="/" className="underline">
              Laporkan!
            </Link>
          </p>
        </section>
        {isCommentAvailable ? (
          <>
            {/* Komentar Form*/}
            <section className="flex w-screen flex-col px-5 py-6 text-white">
              <div className="flex w-full justify-start py-2">
                <h3 className={`${zain.className} text-3xl font-extrabold`}>
                  Komentar
                </h3>
              </div>

              <div className="flex w-full">
                <form action="" className="flex w-full flex-col gap-1">
                  <textarea
                    name="comment"
                    id=""
                    placeholder="Tell us about you, maxs 150 character."
                    className="h-32 w-full rounded-md border border-[#F5F5F540] bg-[#686464] p-2 text-sm text-white placeholder:text-sm placeholder:font-bold placeholder:text-[#979797]"
                  />
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-md border-2 border-[#F5F5F540] bg-[#0E5BA8] py-2 text-sm font-bold"
                  >
                    Kirim Komentar
                  </button>
                </form>
              </div>
            </section>
          </>
        ) : (
          <div className="mx-auto my-4 flex max-w-md items-center gap-2 rounded-lg border border-yellow-300 bg-yellow-100 px-4 py-3 text-sm text-yellow-800 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 flex-shrink-0 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>
            <span>
              Komentar untuk series belum tersedia. Silakan komentar di episode
              yang ingin kamu beri tanggapan.
            </span>
          </div>
        )}
      </main>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
      <Footer />
    </div>
  );
}
