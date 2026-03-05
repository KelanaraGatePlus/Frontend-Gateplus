"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Link from "next/link";
import "@splidejs/react-splide/css/skyblue";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import { useGetHomeBannersQuery } from "@/hooks/api/bannerSliceAPI";

const BLACK = "rgb(10, 10, 15)";
const FADE_MS = 700;

function extractDominantColor(imageUrl) {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const sampleW = Math.min(80, img.width);
        const sampleH = img.height;
        canvas.width = sampleW;
        canvas.height = sampleH;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, sampleW, sampleH);
        const data = ctx.getImageData(0, 0, sampleW, sampleH).data;
        let r = 0,
          g = 0,
          b = 0,
          count = 0;
        for (let i = 0; i < data.length; i += 4 * 8) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        r = Math.round((r / count) * 0.35);
        g = Math.round((g / count) * 0.35);
        b = Math.round((b / count) * 0.35);
        resolve(`rgb(${r}, ${g}, ${b})`);
      } catch {
        resolve(BLACK);
      }
    };
    img.onerror = () => resolve(BLACK);
    img.src = imageUrl;
  });
}

export default function BannerPromoSlider() {
  const [banners, setBanners] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [panelColor, setPanelColor] = useState(BLACK);

  const splideRef = useRef(null);
  const imageTimerRef = useRef(null);
  const bannersRef = useRef([]);
  const videoRefs = useRef([]);
  const dominantColorsRef = useRef({});
  const videoPlayingRef = useRef(false);
  const activeIndexRef = useRef(0);

  const getVideo = (index) => videoRefs.current[index] ?? null;

  const applyColor = useCallback((color) => setPanelColor(color), []);

  const { data, isLoading } = useGetHomeBannersQuery();

  useEffect(() => {
    if (!data?.success) return;

    const sortedBanners = (data.data.hero || [])
      .slice()
      .sort((a, b) => a.priority - b.priority);

    bannersRef.current = sortedBanners;
    videoRefs.current = sortedBanners.map(() => null);
    setBanners(sortedBanners);
  }, [data]);

  useEffect(() => {
    if (!banners.length) return;
    const extractAll = async () => {
      await Promise.all(
        banners.map(async (banner, idx) => {
          if (banner.imageUrl) {
            const color = await extractDominantColor(banner.imageUrl);
            dominantColorsRef.current[idx] = color;
          }
        }),
      );
      applyColor(dominantColorsRef.current[0] ?? BLACK);
    };
    extractAll();
  }, [banners, applyColor]);

  const handleSlideChange = useCallback(
    (rawIndex) => {
      const list = bannersRef.current;
      if (!list.length) return;

      const normalizedIndex =
        ((rawIndex % list.length) + list.length) % list.length;

      const prevIdx = activeIndexRef.current;
      const prevVideo = getVideo(prevIdx);
      if (prevVideo) {
        prevVideo.pause();
        prevVideo.currentTime = 0;
      }

      videoPlayingRef.current = false;
      setShowVideo(false);
      setActiveIndex(normalizedIndex);
      activeIndexRef.current = normalizedIndex;

      if (imageTimerRef.current) clearTimeout(imageTimerRef.current);

      applyColor(dominantColorsRef.current[normalizedIndex] ?? BLACK);

      const currentBanner = list[normalizedIndex];
      if (currentBanner?.trailerUrl) {
        imageTimerRef.current = setTimeout(() => {
          if (activeIndexRef.current !== normalizedIndex) return;

          // Ganti warna ke BLACK DAN trigger fade image keluar secara bersamaan.
          // panelColor tidak punya transition → langsung snap ke BLACK.
          // Image opacity mulai fade (700ms).
          // Hasilnya: kiri dan kanan berubah di saat yang sama persis.
          applyColor(BLACK);
          setShowVideo(true); // video opacity masih 0, tapi sudah di-render

          // Play video setelah image selesai fade out
          setTimeout(() => {
            if (activeIndexRef.current !== normalizedIndex) return;
            videoPlayingRef.current = true;
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                const video = getVideo(normalizedIndex);
                if (video) video.play().catch(() => {});
              });
            });
          }, FADE_MS);
        }, 3000);
      }
    },
    [applyColor],
  );

  const handleVideoEnd = useCallback(
    (index) => {
      if (index !== activeIndexRef.current) return;
      videoPlayingRef.current = false;

      if (bannersRef.current.length > 1) {
        const nextIndex = (index + 1) % bannersRef.current.length;
        applyColor(dominantColorsRef.current[nextIndex] ?? BLACK);
        setTimeout(() => {
          if (index !== activeIndexRef.current) return;
          splideRef.current?.splide.go("+1");
        }, 500);
      } else {
        // Balik ke gambar: warna dan showVideo berubah bersamaan
        applyColor(dominantColorsRef.current[index] ?? BLACK);
        setShowVideo(false);

        imageTimerRef.current = setTimeout(() => {
          if (index !== activeIndexRef.current) return;
          applyColor(BLACK);
          setShowVideo(true);
          setTimeout(() => {
            if (index !== activeIndexRef.current) return;
            videoPlayingRef.current = true;
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                const video = getVideo(index);
                if (video) video.play().catch(() => {});
              });
            });
          }, FADE_MS);
        }, 2000);
      }
    },
    [applyColor],
  );

  const toggleSound = (index) => {
    const video = getVideo(index);
    if (!video) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    video.muted = newMuted;
  };

  const goToSlide = useCallback((idx) => {
    if (imageTimerRef.current) clearTimeout(imageTimerRef.current);
    const currentVideo = getVideo(activeIndexRef.current);
    if (currentVideo) {
      currentVideo.pause();
      currentVideo.currentTime = 0;
    }
    videoPlayingRef.current = false;
    splideRef.current?.splide.go(idx);
  }, []);

  useEffect(() => {
    if (banners.length) handleSlideChange(0);
    return () => {
      if (imageTimerRef.current) clearTimeout(imageTimerRef.current);
    };
  }, [banners]);

  return (
    <div className="w-screenmd:mb-10 relative my-auto">
      {isLoading ? (
        <Skeleton
          height={500}
          width="100%"
          baseColor="#141418"
          highlightColor="#1f1f26"
        />
      ) : (
        <>
          <Splide
            ref={splideRef}
            options={{
              type: banners.length > 1 ? "loop" : "slide",
              perPage: 1,
              arrows: false,
              pagination: false,
              autoplay: false,
              drag: banners.length > 1,
              speed: 800,
              pauseOnHover: true,
            }}
            onMoved={(splide) => handleSlideChange(splide.index)}
          >
            {banners.map((banner, index) => (
              <SplideSlide key={banner.id}>
                <div
                  className="relative flex h-[500px] w-full items-center overflow-hidden"
                  style={{
                    backgroundColor: panelColor,
                  }}
                >
                  {/* teks di banner */}
                  <div className="relative z-10 flex h-full w-[40%] flex-shrink-0 flex-col justify-center px-10 md:px-16">
                    {banner.subTitle && (
                      <p className="zeintFont line-clamp-2 font-semibold break-words text-blue-400 md:text-2xl">
                        {banner.subTitle}
                      </p>
                    )}
                    <h2 className="zeinFont line-clamp-3 text-3xl leading-tight font-extrabold break-words text-white md:line-clamp-2 md:text-5xl">
                      {banner.title}
                    </h2>
                    {banner.description && (
                      <p className="md:text-bas mt-3 line-clamp-3 text-sm leading-relaxed break-words text-white/60">
                        {banner.description}
                      </p>
                    )}
                    {banner.buttonText && banner.linkUrl && (
                      <Link href={banner.linkUrl}>
                        <button className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 active:scale-95">
                          {banner.buttonText}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </Link>
                    )}
                  </div>

                  {/* gambar dan video */}
                  <div className="absolute inset-y-0 right-0 left-[40%] overflow-hidden">
                    <div
                      className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24"
                      style={{
                        background: `linear-gradient(to right, ${panelColor} 0%, transparent 100%)`,
                      }}
                    />

                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      fill
                      priority
                      unoptimized
                      className={`object-cover transition-opacity duration-700 ease-in-out ${
                        showVideo && index === activeIndex
                          ? "pointer-events-none opacity-0"
                          : "opacity-100"
                      }`}
                    />

                    {banner.trailerUrl && (
                      <video
                        ref={(el) => (videoRefs.current[index] = el)}
                        src={banner.trailerUrl}
                        muted={isMuted}
                        playsInline
                        preload="auto"
                        onEnded={() => handleVideoEnd(index)}
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
                          showVideo && index === activeIndex
                            ? "opacity-100"
                            : "pointer-events-none opacity-0"
                        }`}
                      />
                    )}

                    {/* watermark logo */}
                    <div className="absolute bottom-4 left-4 z-30 opacity-50 transition-opacity duration-300 hover:opacity-80">
                      <Image
                        src="/images/logo/logoGate+/logo-header-login.svg"
                        alt="Watermark"
                        width={72}
                        height={22}
                        unoptimized
                        className="object-contain drop-shadow-lg"
                      />
                    </div>

                    {/* tombol mute */}
                    {banner.trailerUrl &&
                      showVideo &&
                      index === activeIndex && (
                        <button
                          onClick={() => toggleSound(index)}
                          className="absolute right-5 bottom-5 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 backdrop-blur-md transition hover:bg-black/80"
                          aria-label={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-9.536a5 5 0 000 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z"
                              />
                            </svg>
                          )}
                        </button>
                      )}
                  </div>
                </div>
              </SplideSlide>
            ))}
          </Splide>

          {/* pagination */}
          {banners.length > 1 && (
            <div
              className="relative flex items-center justify-center py-4"
              style={{
                background:
                  "linear-gradient(to bottom, #19417c 0%, transparent 100%)",
              }}
            >
              <div className="flex items-center gap-2">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeIndex === idx
                        ? "w-6 bg-white"
                        : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
