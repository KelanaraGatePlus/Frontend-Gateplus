import React, { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Link from "next/link";
import "@splidejs/react-splide/css/skyblue";

import bannerPromo1 from "@@/BannerPromo/hero-banner-1.jpg";
import bannerPromo2 from "@@/BannerPromo/hero-banner-2.jpg";
import bannerPromo3 from "@@/BannerPromo/hero-banner-3.jpg";
import bannerPromo4 from "@@/BannerPromo/hero-banner-4.jpg";
import bannerPromo5 from "@@/BannerPromo/hero-banner-5.jpg";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function BannerPromoSlider() {
  const [isLoading, setIsLoading] = useState(true);

  const bannerPromo = [
    {
      id: 1,
      image: bannerPromo1,
      url: "#",
    },
    {
      id: 2,
      image: bannerPromo2,
      url: "/register-creators",
    },
    {
      id: 3,
      image: bannerPromo3,
      url: "/register-creators",
    },
    {
      id: 4,
      image: bannerPromo4,
      url: "/register-creators",
    },
    {
      id: 5,
      image: bannerPromo5,
      url: "/register-creators",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="my-auto mb-0.5 md:mb-10 flex w-screen flex-col md:h-fit shadow-2xl shadow-[#166EB6]/30">
      {isLoading ? (
        <Skeleton
          height={400}
          width="100%"
          borderRadius="0.75rem"
          baseColor="#1c2033"
          highlightColor="#252a42"
        />
      ) : (
        <Splide
          options={{
            type: "loop",
            arrows: false,
            perPage: 1,
            autoplay: true,
            gap: "0rem",
            breakpoints: {
              1024: { perPage: 1 },
              768: { perPage: 1 },
            },
          }}
          aria-label="Banner Foto"
          style={{
            boxShadow: "inset 0 -80px 60px -40px rgba(0, 0, 0, 0.5)",
          }}
        >
          {bannerPromo.map((item) => (
            <SplideSlide key={item.id}>
              <Link href={item.url}>
                <img
                  src={item.image}
                  alt={`BannerPromo00${item.id}`}
                />
              </Link>
            </SplideSlide>
          ))}
        </Splide>
      )}
    </div>
  );
}
