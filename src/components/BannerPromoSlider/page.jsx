/* eslint-disable react/react-in-jsx-scope */
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Image from "next/image";
import Link from "next/link";
import "@splidejs/react-splide/css/skyblue";

import bannerPromo1 from "@@/BannerPromo/hero-banner-1.svg";
import bannerPromo2 from "@@/BannerPromo/hero-banner-2.svg";
import bannerPromo3 from "@@/BannerPromo/hero-banner-3.svg";

export default function sliderBannerPage() {
  const bannerPromo = [
    {
      id: 1,
      image: bannerPromo1,
      url: "#",
    },
    {
      id: 2,
      image: bannerPromo2,
      url: "/RegisterCreators",
    },
    {
      id: 3,
      image: bannerPromo3,
      url: "/RegisterCreators",
    },
  ];

  return (
    <div className="my-auto mt-3.5 mb-0.5 flex w-screen flex-col md:mb-10 md:h-fit">
      <Splide
        options={{
          type: "loop",
          perPage: 1,
          autoplay: true,
          gap: "0rem",
          breakpoints: {
            1024: {
              perPage: 1,
              gap: "0rem",
            },
            768: {
              perPage: 1,
              gap: "0rem",
            },
          },
        }}
        aria-label="Banner Foto"
      >
        {bannerPromo.map((item) => (
          <SplideSlide key={item.id}>
            <Link href={item.url}>
              <Image
                priority
                src={item.image}
                alt={`BannerPromo00${item.id}`}
                layout="responsive"
              />
            </Link>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}
