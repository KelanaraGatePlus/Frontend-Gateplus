/* eslint-disable react/prop-types */
"use client";

import Footer from "@/components/Footer/page";
import Navbar from "@/components/Navbar/page";
import PaginationRounded from "@/components/Pagination/page";
import BackPage from "@/components/BackPage/page";
import BannerCreator from "@@/icons/logo-banner-creator.svg";
import logoUsersComment from "@@/icons/logo-users-comment.svg";
import emptyWorkCreator from "@@/icons/empty-work-creator.svg";
import logoFacebook from "@@/logo/logoSosmed/facebook.svg";
import logoInstagram from "@@/logo/logoSosmed/instagram.svg";
import logoTikTok from "@@/logo/logoSosmed/tiktok.svg";
import logoTwitter from "@@/logo/logoSosmed/twitter.svg";
import FollowingIcon from "@@/icons/following-icon.svg";
import ViewsIcon from "@@/icons/views-icon.svg";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import Toast from "@/components/Toast/page";
import { formatFollowersCount } from "@/lib/followersCount";

/* eslint-disable react/react-in-jsx-scope */
export default function CreatorsPage({ params }) {
  const { id } = use(params);
  const [profileName, setProfileName] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [ebooks, setEbooks] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [totalSubs, setTotalSubs] = useState("0");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [totalViewsAll, setTotalViewsAll] = useState(0);

  const getData = async () => {
    try {
      const userId = localStorage.getItem("users_id");
      const response = await axios.get(
        `https://backend-gateplus-api.my.id/creator/${id}?userId=${userId}`,
      );

      const fullData = response.data.data;
      const creatorData = fullData.data[0];

      // Set ke state
      setProfileName(creatorData.profileName);
      setUsername(creatorData.username);
      setDescription(creatorData.description);
      setInstagramUrl(creatorData.instagramUrl || "");
      setTiktokUrl(creatorData.tiktokUrl || "");
      setTwitterUrl(creatorData.twitterUrl || "");
      setFacebookUrl(creatorData.facebookUrl || "");
      setImageUrl(creatorData.imageUrl || "");
      setBannerImageUrl(creatorData.bannerImageUrl || "");
      setEbooks(creatorData.ebooks);
      setIsSubscribed(fullData.isSubscribed);
      setTotalSubs(fullData.totalCount);
      setTotalViewsAll(fullData.totalViews);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleToggleSubscribe = async () => {
    if (isSubscribed) {
      setShowToast(true);
      return null;
    }
    try {
      setIsSubscribing(true);
      const userId = localStorage.getItem("users_id");
      const creatorId = id;
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
    const currentCreatorId = localStorage.getItem("creators_id");
    if (currentCreatorId && currentCreatorId === id) {
      setIsOwnProfile(true);
    } else {
      setIsOwnProfile(false);
    }
  }, [id]);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex h-screen w-full flex-col">
      <Navbar />
      <main className="relative mx-2 my-2 mt-16 flex flex-col md:mt-24 lg:mx-6">
        <div className="z-0 px-3">
          <BackPage />
        </div>
        <section className="absolute top-1 -z-10 mb-2 hidden h-36 w-full overflow-hidden md:block md:h-64 lg:w-full">
          {bannerImageUrl && bannerImageUrl !== "null" ? (
            <Image
              priority
              src={bannerImageUrl}
              alt="banner-creator"
              fill
              className="object-cover object-center"
            />
          ) : (
            <Image
              priority
              src={BannerCreator}
              alt="banner-creator"
              fill
              className="object-cover object-top"
            />
          )}
        </section>

        <div className="flex w-full flex-col items-start gap-2 transition-all duration-300 ease-out md:mt-32 md:flex-row md:items-end md:px-5">
          <div className="relative mt-1 flex h-fit w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-[#FFFFFF1A] p-4 transition-all duration-300 ease-out md:max-w-[300px] md:min-w-[300px]">
            <section className="absolute top-0 mb-2 h-36 w-full overflow-hidden md:hidden md:h-32 lg:w-full">
              {bannerImageUrl && bannerImageUrl !== "null" ? (
                <Image
                  priority
                  src={bannerImageUrl}
                  alt="banner-creator"
                  fill
                  className="object-cover object-center"
                />
              ) : (
                <Image
                  priority
                  src={BannerCreator}
                  alt="banner-creator"
                  fill
                  className="object-cover object-top"
                />
              )}
            </section>
            {/* Profile */}
            <div className="z-0 mt-8 mb-2 h-32 w-32 shrink-0 rounded-full shadow-2xl transition-all duration-300 ease-out md:mt-2 md:h-36 md:w-36">
              {imageUrl && imageUrl !== "null" ? (
                <Image
                  priority
                  className="h-full w-full rounded-full bg-white object-cover"
                  src={imageUrl}
                  width={128}
                  height={128}
                  alt="logo-usercomment"
                />
              ) : (
                <Image
                  priority
                  className="h-full w-full rounded-full bg-white object-cover"
                  src={logoUsersComment}
                  width={128}
                  height={128}
                  alt="logo-defaultuser"
                />
              )}
            </div>

            {/* personal information */}
            <div className="flex w-full flex-col gap-3">
              {/* Name */}
              <div className="text-white">
                <h1
                  className={`zeinFont mt-2 text-[28px] leading-6 font-semibold lg:text-3xl ${
                    !profileName ? "text-gray-500/60" : ""
                  }`}
                >
                  {profileName || "Nama Profile Belum di atur"}
                </h1>
                <div className="flex items-center gap-1 text-sm text-[12px] leading-4 text-gray-300 lg:text-base">
                  <p>@{username}</p>
                </div>
              </div>
              {/* views dan subs */}
              <div className="grid grid-cols-2 text-white">
                <div className="flex h-6 items-center justify-center gap-1">
                  <Image
                    src={ViewsIcon}
                    alt="views-icon"
                    width={24}
                    height={24}
                    className="object-cover"
                    priority
                  />
                  <p>{totalViewsAll}</p>
                </div>

                <div className="flex h-6 items-center justify-center gap-1">
                  <Image
                    src={FollowingIcon}
                    alt="views-icon"
                    width={24}
                    height={24}
                    className="object-cover"
                    priority
                  />
                  <p className="font-light">
                    {formatFollowersCount(totalSubs)}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p
                className={`min-h-[100px] w-full rounded-md bg-[#2222224D] p-2 text-[12px] text-gray-200 lg:text-base ${!description ? "text-gray-500/60 italic" : ""}`}
              >
                {description || "Tidak ada Deskripsi"}
              </p>

              {/* Social media */}
              <div className="flex justify-between rounded-md px-2">
                {/* Instagram */}
                <Link href={instagramUrl} target="_blank">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-[#0395BC] to-[#0E5BA8]">
                    <Image
                      priority
                      className="aspect-auto"
                      height={26}
                      width={26}
                      alt="instagram"
                      src={logoInstagram}
                    />
                  </div>
                </Link>

                {/* TikTok */}
                <Link href={tiktokUrl} target="_blank">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-[#0395BC] to-[#0E5BA8]">
                    <Image
                      priority
                      className="aspect-auto"
                      height={26}
                      width={26}
                      alt="tikTok"
                      src={logoTikTok}
                    />
                  </div>
                </Link>

                {/* Twitter */}
                <Link href={twitterUrl} target="_blank">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-[#0395BC] to-[#0E5BA8]">
                    <Image
                      priority
                      className="aspect-auto"
                      height={20}
                      width={20}
                      alt="twitter"
                      src={logoTwitter}
                    />
                  </div>
                </Link>

                {/* Facebook */}
                <Link href={facebookUrl} target="_blank">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-[#0395BC] to-[#0E5BA8]">
                    <Image
                      priority
                      className="aspect-auto"
                      height={20}
                      width={20}
                      alt="facebook"
                      src={logoFacebook}
                    />
                  </div>
                </Link>
              </div>

              {/* Edit Profile */}
              {isOwnProfile ? (
                <button className="mt-1 rounded-lg bg-[#0E5BA8] py-2 font-bold text-white hover:bg-[#0E5BA8]/80">
                  <Link href="/Creators/Setting">
                    <p>Edit Profile</p>
                  </Link>
                </button>
              ) : (
                <button
                  className={`mt-1 rounded-lg py-2 font-bold text-white ${isSubscribed ? "bg-gray-500 hover:bg-gray-500/80" : "bg-[#0E5BA8] hover:bg-[#0E5BA8]/80"} cursor-pointer lg:mt-8`}
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

          <section className="mt-4 w-full transition-all duration-300 ease-out">
            <div className="my-2 flex h-fit justify-between text-white md:mx-5 lg:-mb-4">
              <span className="text-lg font-bold md:mb-5 md:text-[24px]">
                Banyak Dilihat
              </span>
            </div>
            <div className="grid grid-cols-3 justify-items-center gap-2 p-0 sm:grid-cols-4 lg:grid-cols-4">
              {ebooks.length > 0 ? (
                ebooks
                  .sort((a, b) => b.totalViews - a.totalViews)
                  .slice(0, 4)
                  .map((ebook, index) => (
                    <Link
                      key={ebook.id}
                      href={`/Ebook/DetailEbook/${ebook.id}`}
                    >
                      <div className="relative cursor-pointer overflow-hidden rounded-lg border-2 border-transparent text-center transition duration-300 hover:scale-105 hover:border-blue-600">
                        <div className="absolute bottom-0 left-0 z-10 w-full bg-[#0395BCB2]/80 py-2 text-xs font-bold text-white md:text-sm">
                          Lihat Karya
                        </div>
                        <div className="absolute top-3 z-10 flex w-full items-center justify-between gap-1 px-3">
                          <div className="zeinFont flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 text-2xl font-bold text-white shadow-lg ring-2 shadow-blue-500/50 ring-blue-300">
                            {index + 1}
                          </div>
                          <div className="bg-opacity-60 h-fit rounded-md bg-black/85 px-2 py-1 text-xs text-white">
                            👁 {ebook.totalViews}
                          </div>
                        </div>

                        <div className="relative h-[180px] w-[120px] sm:h-[200px] sm:w-[140px] md:h-[300px] md:w-[210px]">
                          <Image
                            priority
                            src={ebook.coverImageUrl}
                            alt={ebook.title}
                            fill
                            className="rounded-lg object-cover"
                          />
                        </div>
                      </div>
                    </Link>
                  ))
              ) : (
                <div className="col-span-full flex w-full flex-col items-center">
                  {/* Image */}
                  <div className="relative h-[280px] w-[230px] md:h-[225px] md:w-[180px]">
                    <Image
                      src={emptyWorkCreator}
                      alt="belum ada karya"
                      fill
                      priority
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col items-center p-4 text-white">
                    <h3 className="zeinFont text-center text-2xl font-bold">
                      Konten Lagi On Progress!
                    </h3>
                    <p className="montserratFont text-center text-xs">
                      Sedang disiapin nih, cek lagi nanti buat yang seru-seru!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Carousel Most View */}
        <section className="mt-4">
          <div className="my-2 flex h-fit justify-between text-white md:mx-5 lg:-mb-4">
            <span className="text-lg font-bold md:mb-5 md:ml-3 md:text-[24px]">
              Baru Ditambahkan
            </span>
            <span className="text-base font-medium text-[#14CAFB] md:mr-3 md:mb-5 md:text-[20px]">
              Lainnya
            </span>
          </div>
          <div className="grid grid-cols-3 justify-items-center gap-2 p-0 sm:grid-cols-4 lg:grid-cols-5 lg:gap-4 lg:px-6 lg:py-4">
            {ebooks.length > 0 ? (
              ebooks
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((ebook) => (
                  <Link key={ebook.id} href={`/Ebook/DetailEbook/${ebook.id}`}>
                    <div className="relative cursor-pointer overflow-hidden rounded-lg border-2 border-transparent text-center transition duration-300 hover:scale-105 hover:border-blue-600">
                      <div className="absolute bottom-0 left-0 z-10 w-full bg-[#0395BCB2]/80 py-2 text-xs font-bold text-white md:text-sm">
                        Lihat Karya
                      </div>

                      <div className="relative h-[180px] w-[120px] sm:h-[200px] sm:w-[140px] md:h-[280px] md:w-[180px] lg:h-[340px] lg:w-[240px]">
                        <Image
                          priority
                          src={ebook.coverImageUrl}
                          alt={ebook.title}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                    </div>
                  </Link>
                ))
            ) : (
              <div className="col-span-full flex w-full flex-col items-center">
                {/* Image */}
                <div className="relative h-[280px] w-[230px] md:h-[400px] md:w-[330px]">
                  <Image
                    src={emptyWorkCreator}
                    alt="belum ada karya"
                    fill
                    priority
                    className="object-cover object-center"
                  />
                </div>

                {/* Text */}
                <div className="flex flex-col items-center p-4 text-white">
                  <h3 className="zeinFont text-center text-3xl font-bold">
                    Konten Lagi On Progress!
                  </h3>
                  <p className="montserratFont text-center text-sm">
                    Sedang disiapin nih, cek lagi nanti buat yang seru-seru!
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mx-5 mt-10 flex justify-center">
          <PaginationRounded />
        </section>
      </main>

      {showToast && (
        <Toast
          message={`Untuk saat ini belum bisa Unsubscribe Creator (${profileName})`}
          type="failed"
          onClose={() => setShowToast(false)}
        />
      )}
      <Footer />
    </div>
  );
}
