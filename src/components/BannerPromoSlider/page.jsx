/* eslint-disable react/react-in-jsx-scope */
import bannerPromoMiddle from "@@/BannerPromo/Hero-1.svg";
import bannerPromoEnd from "@@/BannerPromo/Hero-2.svg";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/skyblue";
import Image from "next/legacy/image";

export default function sliderBannerPage() {
  return (
    <div className="my-auto mt-3.5 mb-0.5 flex w-screen flex-col md:h-fit">
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
        <SplideSlide>
          <Image
            priority
            src={bannerPromoMiddle}
            alt="BannerPromo002"
            layout="responsive"
          />
        </SplideSlide>
        <SplideSlide>
          <Image
            priority
            src={bannerPromoEnd}
            alt="BannerPromo003"
            layout="responsive"
          />
        </SplideSlide>
      </Splide>
    </div>
  );
}
