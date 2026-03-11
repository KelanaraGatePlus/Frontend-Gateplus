"use client";
import React from "react";
import PropTypes from "prop-types";
import ProductDetailSection from "@/components/MainDetailProduct/ProductDetailSection";
import ProductEpisodeSection from "@/components/MainDetailProduct/ProductEpisodeSection";
import CarouselTemplate from "../Carousel/carouselTemplate";
import { cn } from "@/lib/utils";
import slugifyTitle from "@/lib/helper/slugifyTitle";

export default function MainTemplateLayout({
  productType,
  productDetail,
  productEpisode,
  isLoading = true,
  currentlyPlaying,
  handlePlayPodcast,
  handlePayment,
  topContentData,
  recomendationData,
  refreshTrigger,
  setRefreshTrigger,
  isBlurred,
}) {
  // Fungsi ekstra aman untuk mengambil ID Saved dari berbagai kemungkinan struktur backend
  const getSavedId = () => {
    if (!productDetail) return null;

    return (
      productDetail?.idSaved ||
      productDetail?.savedBy?.[0]?.id ||
      productDetail?.isSavedUser?.id ||
      (productDetail?.isSaved && typeof productDetail.isSaved === "object"
        ? productDetail.isSaved?.id
        : null)
    );
  };

  const idSavedProduct = getSavedId();
  const contentSlug = slugifyTitle(productDetail?.title);

  const sharePath = contentSlug
    ? `/${productType === "podcast" ? "podcasts" : `${productType}s`}/${contentSlug}`
    : undefined;

  return (
    <main className="flex flex-col">
      <ProductDetailSection
        productType={productType}
        productID={productDetail?.id}
        productBanner={productDetail?.coverImageUrl}
        productCover={
          productType === "podcast"
            ? productDetail?.coverPodcastImage
            : productDetail?.posterImageUrl
        }
        productTitle={productDetail?.title}
        productDescription={productDetail?.description}
        productAgeRestriction={productDetail?.ageRestriction}
        productGenre={
          Array.isArray(productDetail?.categories)
            ? productDetail.categories
                .map((cat) => cat.category?.tittle || cat.category?.title)
                .join(", ")
            : productDetail?.categories?.tittle ||
              productDetail?.categories?.title
        }
        productLanguage={productDetail?.language}
        productFirstEpisode={productEpisode?.[0]}
        productIsLiked={productDetail?.isLiked}
        productIsDisliked={productDetail?.isDisliked}
        productIsSaved={!!productDetail?.isSaved}
        productTotalViews={productDetail?.totalViews}
        productTotalLikes={productDetail?.totalLikes}
        creatorDetail={
          productType === "podcast"
            ? productDetail?.Creator
            : productDetail?.creators
        }
        creatorTotalSubscriber={productDetail?.totalSubscribers}
        creatorIsSubscribed={
          productDetail?.isSubscribedToCreator?.data?.length > 0
        }
        idLikedProduct={productDetail?.isLiked?.id || productDetail?.idLiked}
        idDislikedProduct={
          productDetail?.isDisliked?.id || productDetail?.idDisliked
        }
        idSavedProduct={idSavedProduct}
        canSubscribe={productDetail?.canSubscribe}
        subscriptionPrice={productDetail?.subscriptionPrice}
        isLoading={isLoading}
        isSubscribe={productDetail?.isSubscribe && productDetail?.canSubscribe}
        isOwner={productDetail?.isOwner || false}
        refreshTrigger={refreshTrigger}
        setRefreshTrigger={setRefreshTrigger}
        sharePath={sharePath}
        isBlurred
      />

      <div>
        <ProductEpisodeSection
          productType={productType}
          productEpisodes={productEpisode}
          isLoading={isLoading}
          currentlyPlaying={currentlyPlaying}
          handlePlayPodcast={handlePlayPodcast}
          handlePayment={handlePayment}
          isSubscribe={
            productDetail?.isSubscribe && productDetail?.canSubscribe
          }
          productId={productDetail?.id}
          isOwner={productDetail?.isOwner || false}
          itemClassname={cn("px-4 md:px-15")}
        />
      </div>

      <CarouselTemplate
        label="Banyak Dilihat"
        type={productType}
        contents={topContentData}
        isLoading={isLoading}
        withTopTag={false}
        isBlurred={isBlurred}
      />
      <CarouselTemplate
        label="Rekomendasi Serupa"
        type={productType}
        contents={recomendationData}
        isLoading={isLoading}
        withTopTag={false}
        isBlurred={isBlurred}
      />
    </main>
  );
}

MainTemplateLayout.propTypes = {
  productType: PropTypes.oneOf(["podcast", "ebook", "comic"]).isRequired,
  productDetail: PropTypes.object.isRequired,
  productEpisode: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  currentlyPlaying: PropTypes.object,
  handlePlayPodcast: PropTypes.func,
  handlePayment: PropTypes.func,
  topContentData: PropTypes.array.isRequired,
  recomendationData: PropTypes.array.isRequired,
  refreshTrigger: PropTypes.any,
  setRefreshTrigger: PropTypes.func,
  isBlurred: PropTypes.func,
};
