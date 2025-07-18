/* eslint-disable react/react-in-jsx-scope */
"use client";

import logoUsersComment from "@@/AvatarIcons/avatar-face-2.jpg";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchResult() {
  const searchParams = useSearchParams();
  const query = searchParams.get("search");
  const [creatorsResult, setCreatorsResult] = useState([]);
  const [ebooksResult, setEbooksResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSearchResults = async (searchQuery) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/search?q=${searchQuery}`,
      );
      setCreatorsResult(response.data.creators);
      setEbooksResult(response.data.ebooks);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.delete("search");
    window.history.replaceState({}, "", `?${updatedParams.toString()}`);
  };

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    }
  }, [query]);

  if (!query) return null;

  return (
    <div className="fixed top-[135px] z-40 flex h-[calc(100vh-4rem)] w-full flex-col overflow-auto rounded-t-4xl bg-black/90 px-4 py-3 text-white backdrop-blur">
      {/* Close button */}
      <div
        className="absolute top-5 right-6 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-500/60 p-3 text-white"
        onClick={handleClose}
      >
        &times;
      </div>
      <h1 className="text-center font-bold">Search Result ({query})</h1>
      {/* container */}
      {loading ? (
        <div className="text-center font-bold">Loading...</div>
      ) : (
        <div className="mt-3 flex flex-col">
          {/* creator result */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Creator</h2>
            {/* hasil kreator conrtainer */}
            {creatorsResult.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-wrap lg:gap-2">
                {creatorsResult
                  .sort(
                    (a, b) => b._count.subscriptions - a._count.subscriptions,
                  )
                  .map((creator, index) => (
                    <Link href={`/Creators/${creator.id}`} key={index}>
                      <div
                        className="flex h-[150px] w-fit max-w-[90px] cursor-pointer flex-col items-center justify-center rounded-xl bg-white/50 p-2 hover:border hover:border-blue-500 hover:bg-white/40 lg:w-[150px] lg:min-w-[150px]"
                        key={index}
                      >
                        <figure className="relative mb-2 h-[60px] max-h-[60px] w-[60px] max-w-[60px]">
                          {creator.imageUrl ? (
                            <Image
                              src={creator.imageUrl}
                              alt="creator profile"
                              fill
                              className="rounded-full object-cover object-center"
                            />
                          ) : (
                            <Image
                              src={logoUsersComment}
                              alt="creator profile"
                              width={60}
                              height={60}
                              className="rounded-full object-cover object-center"
                            />
                          )}
                        </figure>
                        <h3 className="text-center text-base leading-5 font-bold">
                          {creator.profileName || creator.username}
                        </h3>
                        <p className="text-xs italic">
                          {creator._count.subscriptions}{" "}
                          {creator._count.subscriptions > 1
                            ? " Followers"
                            : " Follower"}
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            ) : (
              <p className="text-left italic">Tidak ada hasil pencarian</p>
            )}
          </div>
          {/* book result */}
          <div className="mt-3 flex flex-col">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">Ebooks</h2>
              {/* hasil ebook conrtainer */}
              <div className="flex w-full flex-col">
                {ebooksResult.length > 0 ? (
                  <div className="flex flex-col gap-2 xl:grid xl:grid-cols-3">
                    {ebooksResult
                      .sort((a, b) => b.createdAt - a.createdAt)
                      .map((ebook, index) => (
                        <Link
                          href={`/Ebook/DetailEbook/${ebook.id}`}
                          key={index}
                        >
                          <div className="flex w-full justify-start gap-2 rounded-xl border border-transparent bg-white/50 p-2 hover:border-blue-500 hover:bg-white/40">
                            <figure className="relative h-[100px] w-[80px]">
                              {ebook.coverImageUrl ? (
                                <Image
                                  src={ebook.coverImageUrl}
                                  alt="cover book"
                                  fill
                                  className="rounded-lg object-cover object-center"
                                />
                              ) : (
                                <Image
                                  src={logoUsersComment}
                                  alt="cover book"
                                  fill
                                  className="rounded-lg object-cover object-center"
                                />
                              )}
                            </figure>
                            <div className="flex flex-1 flex-col items-start justify-start gap-0.5">
                              <h3 className="text-left text-base leading-5 font-bold">
                                {ebook.title}
                              </h3>
                              <div className="flex gap-1 text-xs font-semibold">
                                <p className="max-w-[100px] truncate overflow-hidden whitespace-nowrap">
                                  {ebook.creators.profileName}
                                </p>
                                <p className="">|</p>
                                <p className="">{ebook.categories.tittle}</p>
                              </div>
                              <p className="text-light line-clamp-4 text-justify text-xs leading-none text-white/80">
                                {ebook.description === "-"
                                  ? "Tidak ada deskripsi"
                                  : ebook.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                ) : (
                  <p className="text-left italic">Tidak ada hasil pencarian</p>
                )}
              </div>
            </div>
          </div>
          <div className="block h-20 w-full bg-transparent text-transparent">
            {"GatePlus"}
          </div>
        </div>
      )}
    </div>
  );
}
