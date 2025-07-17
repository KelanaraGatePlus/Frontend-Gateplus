/* eslint-disable react/react-in-jsx-scope */
"use client";

import BackPage from "@/components/BackPage/page";
import EpubReader from "@/components/EbookReader/page";
import iconMoreMenuComment from "@@/icons/icon-comment.svg";
import logoUsersComment from "@@/icons/logo-users-comment.svg";
import logoArrowDownDark from "@@/icons/icons-dashboard/icons-arrow-left.svg";
import logoArrowDownLight from "@@/icons/icons-dashboard/icons-arrow-left-light.svg";
import IconsDislikeComment from "@@/logo/logoDetailEbook/icon-dislike-comment.svg";
import { formatDateTime } from "@/lib/timeFormatter";
import IconsLikeComment from "@@/logo/logoDetailEbook/icon-like-comment.svg";
import axios from "axios";
import { Zain } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

const zain = Zain({
  variable: "--font-zain",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  weight: ["200", "400", "700", "800"],
});

// eslint-disable-next-line react/prop-types
export default function ReadEbookPage({ params }) {
  const { id } = use(params);
  const [ebookTitle, setEbookTitle] = useState("");
  const [ebookId, setEbookId] = useState("");
  const [title, setTitle] = useState("");
  const [creatorNotes, setCreatorNotes] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [bannerStartEpisodeUrl, setBannerStartEpisodeUrl] = useState(null);
  const [bannerEndEpisodeUrl, setBannerEndEpisodeUrl] = useState(null);
  const [ebookUrl, setEbookUrl] = useState(null);
  const [allEpisodes, setAllEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [allComments, setAllComments] = useState([]);
  const [myComment, setMyComment] = useState("");
  const [isUploadingComment, setIsUploadingComment] = useState(false);
  const [isDark, setIsDark] = useState(false);
  let hasUpdatedViews = false;

  const currentIndex = allEpisodes.findIndex(
    (ep) => ep.id === currentEpisode.id,
  );
  const prevEpisode = allEpisodes[currentIndex - 1];
  const nextEpisode = allEpisodes[currentIndex + 1];

  const getData = async () => {
    try {
      const response = await axios.get(
        `https://backend-gateplus-api.my.id/episode/${id}`,
      );

      const ebookSingleData = response.data.data.data[0];

      if (!hasUpdatedViews) {
        console.log("Tambah Views");
        await axios.patch(
          `https://backend-gateplus-api.my.id/episode/${id}/views`,
        );
        hasUpdatedViews = true;
      }

      setTitle(ebookSingleData.title);
      setEbookTitle(ebookSingleData.ebooks.title);
      setEbookId(ebookSingleData.ebooks.id);
      setCreatorNotes(ebookSingleData.notedEpisode);
      setEbookUrl(ebookSingleData.ebookUrl);
      setBannerStartEpisodeUrl(ebookSingleData.bannerStartEpisodeUrl);
      setBannerEndEpisodeUrl(ebookSingleData.bannerEndEpisodeUrl);
      setUpdatedAt(formatDateTime(ebookSingleData.updatedAt, "short"));
      console.log(ebookSingleData);
      const existing = JSON.parse(localStorage.getItem("last_seen_content")) || [];
      const isAlreadyExist = existing.find(item => item.id === ebookSingleData.ebooks.id);
      let updated = existing;
      if (!isAlreadyExist) {
        const newContent = {
          ...ebookSingleData.ebooks,
          type: "ebook",
        };
        updated = [newContent, ...existing].slice(0, 10);
      }
      localStorage.setItem("last_seen_content", JSON.stringify(updated));

      setCurrentEpisode(ebookSingleData);
      const ebookId = ebookSingleData.ebooks.id;
      const resAll = await axios.get(
        `https://backend-gateplus-api.my.id/ebooks/${ebookId}`,
      );
      const allEpisodesData = resAll.data.data.data.episode_ebooks;
      setAllEpisodes(allEpisodesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getCommentData = async () => {
    try {
      const response = await axios.get(
        `https://backend-gateplus-api.my.id/comment/by-ebook-episode/${id}`,
      );

      console.log(response.data.data.data);
      const allCommentsData = response.data.data.data;
      setAllComments(allCommentsData);
      console.log("ini data nya", allComments);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSubmitComment = async (e) => {
    e.preventDefault();

    try {
      setIsUploadingComment(true);
      const userId = localStorage.getItem("users_id");
      const response = await axios.post(
        `https://backend-gateplus-api.my.id/comment`,
        {
          userId: userId,
          episodeEbookId: id,
          message: myComment,
        },
      );
      console.log(response.data);
      setMyComment("");
      getCommentData();
    } catch (error) {
      console.error("Error during post request:", error);
    } finally {
      setIsUploadingComment(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  useEffect(() => {
    getData();
    getCommentData();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const darkMode = localStorage.getItem("theme") === "dark";
      setIsDark(darkMode);
    }
  }, []);

  return (
    <div
      className={`flex flex-col overflow-x-hidden ${isDark ? "bg-[#222222]" : "bg-[#fff]"}`}
    >
      <main className="flex flex-col">
        <div
          className={`${isDark ? "text-white" : "text-[#222222]"} fixed z-10 mt-0 flex w-full flex-row items-center justify-start gap-2 px-4 py-2 text-2xl font-semibold backdrop-blur`}
        >
          <BackPage isDark={isDark} />
          <h4
            className={` ${zain.className} [display:-webkit-box] w-full overflow-hidden text-center text-xl font-extrabold text-ellipsis [-webkit-box-orient:vertical] [-webkit-line-clamp:1] md:text-2xl`}
          >
            <Link
              href={`/Ebook/DetailEbook/${ebookId}`}
              className="hover:underline"
            >
              {ebookTitle || "Loading..."}
            </Link>
          </h4>
          {/* toggle dark and light */}
          <label className="inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={isDark}
              onChange={toggleTheme}
              className="peer sr-only"
            />
            <div
              className={`relative h-7 w-14 rounded-full transition-colors duration-300 ${isDark
                ? "bg-indigo-900 peer-focus:ring-2 peer-focus:ring-violet-800"
                : "bg-amber-200 peer-focus:ring-2 peer-focus:ring-amber-400"
                } `}
            >
              <div
                className={`absolute top-1/2 left-[2px] flex h-5 w-5 -translate-y-1/2 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${isDark ? "translate-x-7" : "translate-x-1"}`}
              >
                {isDark ? (
                  <svg
                    className="h-4 w-4 text-violet-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    />
                  </svg>
                )}
              </div>
            </div>
          </label>
        </div>
        {/* Bagian Header */}
        <section className="relative mt-[75px] w-full">
          {/* banner */}
          <div className="h-64 w-full overflow-hidden">
            {bannerStartEpisodeUrl && (
              <Image
                priority
                src={bannerStartEpisodeUrl}
                fill
                alt="poster-ebook-laut-bercerita"
                className="h-full w-full object-cover object-center"
              />
            )}
            <div
              className={`absolute top-0 left-0 z-0 h-full w-full ${isDark ? "bg-[linear-gradient(to_bottom,_#FFFFFF00,_#FFFFFF00,_#FFFFFF00,_#FFFFFF00,_#737373A1,_#595959BF,_#3F3F3FDE,_#303030ED,_#222222FF)]" : "bg-[linear-gradient(to_bottom,_#00000000,_#00000000,_#00000000,_#00000000,_#E5E5E5A1,_#E0E0E0BF,_#D4D4D4DE,_#CCCCCCED,_#FFFFFF)]"}`}
            />
          </div>
        </section>
        {/* Isi Ebook */}
        <div
          className={`relative flex w-screen flex-col px-4 py-5 ${isDark ? "text-white" : "text-[#222222]"} md:px-15`}
        >
          {/* Judul Chapter */}
          <h1 className="w-full text-center text-2xl font-bold lg:text-3xl">
            {title}
          </h1>

          {/* Cerita */}
          <div className="flex flex-col justify-center">
            {/* Update Message */}
            <p
              className={`mt-1 w-full text-center text-sm ${isDark ? "text-white/70" : "text-[#222222]/70"} italic`}
            >
              Terakhir Diperbarui: {updatedAt}
            </p>

            {/* Isi Buku */}
            <div
              className={`mt-8 mb-10 flex h-fit flex-col ${isDark ? "text-white" : "text-[#222222]"}`}
            >
              {ebookUrl && <EpubReader epubUrl={ebookUrl} isDark={isDark} />}
            </div>
          </div>
        </div>
        {/* Banner 2 */}
        <div className="relative h-64 w-full overflow-hidden">
          {bannerEndEpisodeUrl && (
            <Image
              src={bannerEndEpisodeUrl}
              fill
              alt="poster-ebook-laut-bercerita"
              className="h-full w-full object-cover object-center"
            />
          )}
          <div
            className={`absolute top-0 left-0 z-0 h-full w-full ${isDark ? "bg-[linear-gradient(to_bottom,_#FFFFFF00,_#FFFFFF00,_#FFFFFF00,_#FFFFFF00,_#737373A1,_#595959BF,_#3F3F3FDE,_#303030ED,_#222222FF)]" : "bg-[linear-gradient(to_bottom,_#00000000,_#00000000,_#00000000,_#00000000,_#E5E5E5A1,_#E0E0E0BF,_#D4D4D4DE,_#CCCCCCED,_#FFFFFF)]"}`}
          />
        </div>
        {/* Catatan Kreator */}
        <section
          className={`relative flex w-screen flex-col px-4 pt-5 ${isDark ? "text-white" : "text-[#222222]"} md:mt-4 md:px-15`}
        >
          <div
            className={`w-full rounded-xl p-4 ${isDark ? "bg-[#2f2f2f] text-white" : "bg-[#DEDEDE] text-[#222222]"}`}
          >
            <h4
              className={`${isDark ? "text-white/70" : "text-black/60"} font-bold`}
            >
              Catatan Kreator
            </h4>
            <p className={`${isDark ? "text-white" : "text-[#222222]"}`}>
              {creatorNotes}
            </p>
          </div>
        </section>

        {/* Next / Previous Chapter */}
        <section
          className={`relative flex w-screen flex-row gap-2 px-4 py-2 ${isDark ? "text-white" : "text-[#222222]"} md:px-15`}
        >
          {prevEpisode ? (
            <Link
              href={`/Ebook/ReadEbook/${prevEpisode.id}`}
              className={`flex flex-1 justify-center gap-2 rounded-lg px-2 py-2 ${isDark ? "bg-[#3939394D]" : "bg-[#DEDEDE]"}`}
            >
              <div className="flex h-8 w-8 rotate-0 items-center justify-center self-center">
                {isDark ? (
                  <Image
                    width={35}
                    alt="logo-arrow-down"
                    src={logoArrowDownDark}
                    className="object-cover"
                  />
                ) : (
                  <Image
                    width={35}
                    alt="logo-arrow-down"
                    src={logoArrowDownLight}
                    className="object-cover"
                  />
                )}
              </div>
              <p className="flex h-fit self-center leading-tight font-bold">
                Episode Sebelumnya
              </p>
            </Link>
          ) : (
            <div
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-2 py-2 ${isDark ? "bg-[#3939394D]" : "bg-[#DEDEDE]"}`}
            >
              <p className="text-sm">Tidak ada episode sebelumnya</p>
            </div>
          )}
          {nextEpisode ? (
            <Link
              href={`/Ebook/ReadEbook/${nextEpisode.id}`}
              className={`flex flex-1 justify-center gap-2 rounded-lg px-2 py-2 ${isDark ? "bg-[#3939394D]" : "bg-[#DEDEDE]"}`}
            >
              <p className="flex h-fit self-center leading-tight font-bold">
                Episode Selanjutnya
              </p>
              <div className="flex h-8 w-8 -rotate-180 items-center justify-center self-center">
                {isDark ? (
                  <Image
                    width={35}
                    alt="logo-arrow-down"
                    src={logoArrowDownDark}
                    className="object-cover"
                  />
                ) : (
                  <Image
                    width={35}
                    alt="logo-arrow-down"
                    src={logoArrowDownLight}
                    className="object-cover"
                  />
                )}
              </div>
            </Link>
          ) : (
            <div
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-2 py-2 ${isDark ? "bg-[#3939394D]" : "bg-[#DEDEDE]"}`}
            >
              <p className="text-sm">Tidak ada episode selanjutnya</p>
            </div>
          )}
        </section>

        <div className="flex flex-1 items-center justify-center text-center">
          <p
            className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Episode {currentIndex + 1} dari {allEpisodes.length}
          </p>
        </div>

        {/* SawerKuy */}
        <section
          className={`relative flex w-screen flex-col px-4 py-5 md:px-15 ${isDark ? "text-white" : "text-[#222222]"
            }`}
        >
          <div
            className={`w-full rounded-xl p-4 ${isDark ? "bg-[#2f2f2f] text-white" : "bg-[#e0e0e0] text-[#222222]"
              }`}
          >
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
            <Link href="#" className="underline">
              aturan (Syarat & Ketentuan)
            </Link>
            ? Laporkan aja kalau ada yang nggak sesuai ya!{" "}
            <Link href="#" className="underline">
              Laporkan!
            </Link>
          </p>
        </section>

        {/* Komentar Form*/}
        <section
          className={`flex w-screen flex-col px-5 py-6 ${isDark ? "text-white" : "text-[#222222]"}`}
        >
          <div className="flex w-full justify-start py-2">
            <h3 className={`${zain.className} text-3xl font-extrabold`}>
              Komentar
            </h3>
          </div>

          <div className="flex w-full">
            <form
              className="flex w-full flex-col gap-2.5"
              onSubmit={handleSubmitComment}
            >
              <textarea
                name="comment"
                id="comment"
                placeholder="Tell us about you, maxs 150 character."
                className={`h-32 w-full rounded-md border p-2 text-sm transition-colors duration-300 placeholder:text-sm placeholder:font-bold ${isDark
                  ? "border-[#F5F5F540] bg-[#686464] text-white placeholder:text-[#979797]"
                  : "border-[#d0d0d0] bg-[#f0f0f0] text-[#444444] placeholder:text-[#555555]"
                  }`}
                value={myComment}
                onChange={(e) => setMyComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment(e);
                  }
                }}
                required
              />
              <button
                disabled={isUploadingComment}
                type="submit"
                className={`flex w-full items-center justify-center rounded-md border-2 py-2 text-sm font-bold ${isUploadingComment
                  ? "cursor-not-allowed bg-gray-500"
                  : isDark
                    ? "cursor-pointer border-[#F5F5F540] bg-[#0E5BA8] text-white"
                    : "cursor-pointer border-gray-300 bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {isUploadingComment ? "Mengirim..." : "Kirim Komentar"}
              </button>
            </form>
          </div>
        </section>

        {/* Komentar  */}
        <section
          className={`mb-10 flex w-screen flex-col gap-1 px-5 py-6 ${isDark ? "text-white" : "text-gray-900"
            }`}
        >
          {allComments.length > 0 ? (
            [...allComments]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((comment) => (
                <div
                  className={`flex flex-col gap-4 rounded-lg py-4 ${isDark ? "bg-transparent" : "bg-[#e0e0e0]"}`}
                  key={comment.id}
                >
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-2 px-4">
                      <figure>
                        <Image
                          priority
                          className="h-10 w-10 rounded-full bg-blue-300 object-cover object-center"
                          src={
                            comment.user.imageUrl
                              ? comment.user.imageUrl
                              : logoUsersComment
                          }
                          alt="logo-usercomment"
                          width={40}
                          height={40}
                        />
                      </figure>

                      <div>
                        <h5 className="text-xs font-medium">
                          {comment.user.profileName
                            ? comment.user.profileName
                            : comment.user.username}{" "}
                          {comment.user.creator &&
                            comment.user.creator.id ===
                            comment.ebook_episode.ebooks.creators.id &&
                            "(Author)"}
                        </h5>
                        <p className="text-[10px] font-normal">
                          {formatDateTime(comment.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="px-4">
                      <Image
                        priority
                        className="h-5"
                        src={iconMoreMenuComment}
                        alt="logo-more-menu-comment"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 px-4">
                    <div className="mb-2 flex">
                      <p className="text-base font-semibold text-[#979797]">
                        {comment.message}
                      </p>
                    </div>

                    <div className="flex justify-start gap-4">
                      <button className="text-sm font-medium text-[#1DBDF5]">
                        Balas
                      </button>

                      <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                          <Image
                            priority
                            className="h-5 w-5 focus-within:bg-purple-300"
                            width={35}
                            alt="logo-like"
                            src={IconsLikeComment}
                          />
                          <p className="text-[#1DBDF5]">Ya</p>
                        </div>

                        <div className="flex items-center gap-1">
                          <Image
                            priority
                            className="h-5 w-5 focus-within:bg-purple-300"
                            width={35}
                            alt="logo-like"
                            src={IconsDislikeComment}
                          />
                          <p className="text-[#1DBDF5]">Tidak</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center text-gray-400 italic">
              Belum ada Komentar
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
