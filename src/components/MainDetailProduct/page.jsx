"use client";
import React from "react";
import PropTypes from "prop-types";

/*[--- COMPONENTS IMPORT ---]*/
import ProductDetailSection from "@/components/MainDetailProduct/ProductDetailSection";
import ProductEpisodeSection from "@/components/MainDetailProduct/ProductEpisodeSection";
import CarouselTemplate from "../Carousel/carouselTemplate";
import { cn } from "@/lib/utils";

export default function MainTemplateLayout({
  productType,
  productDetail,
  productEpisode,
  isLoading = true,
  currentlyPlaying,
  handlePlayPodcast,
  handlePayment,
  handleSubscribe,
  topContentData,
  recomendationData,
}) {
  return (
    <main className="flex flex-col">
      <ProductDetailSection
        productType={productType}
        productID={productDetail.id}
        productBanner={productDetail.posterImageUrl}
        productCover={productType === 'podcast' ? productDetail.coverPodcastImage : productDetail.posterImageUrl}
        productTitle={productDetail.title}
        productDescription={productDetail.description}
        productAgeRestriction={productDetail.ageRestriction}
        productGenre={Array.isArray(productDetail?.categories) ? productDetail.categories.map(cat => cat.category.tittle || cat.category.title).join(', ') : productDetail?.categories?.tittle || productDetail?.categories?.title}
        productLanguage={productDetail.language}
        productFirstEpisode={productEpisode?.[0]}
        productIsLiked={productDetail.isLiked}
        productIsDisliked={productDetail.isDisliked}
        productIsSaved={productDetail.isSaved}
        productTotalViews={productDetail.totalViews}
        productTotalLikes={productDetail.totalLikes}
        creatorDetail={productType === 'podcast' ? productDetail.Creator : productDetail.creators}
        creatorTotalSubscriber={productDetail?.totalSubscribers}
        creatorIsSubscribed={productDetail?.isSubscribedToCreator?.data?.length > 0 ? true : false}
        idLikedProduct={productDetail?.isLiked?.id}
        idDislikedProduct={productDetail?.isDisliked?.id}
        idSavedProduct={productDetail?.savedBy?.[0]?.id}
        canSubscribe={productDetail.canSubscribe}
        subscriptionPrice={productDetail.subscriptionPrice}
        isLoading={isLoading}
        handleSubscribe={handleSubscribe}
        isSubscribe={productDetail?.isSubscribe && productDetail?.canSubscribe ? true : false}
        isOwner={productDetail?.isOwner || false}
      />

      <div>
        <ProductEpisodeSection
          productType={productType}
          productEpisodes={productEpisode}
          isLoading={isLoading}
          currentlyPlaying={currentlyPlaying}
          handlePlayPodcast={handlePlayPodcast}
          handlePayment={handlePayment}
          isSubscribe={productDetail?.isSubscribe && productDetail?.canSubscribe ? true : false}
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
      />

      <CarouselTemplate
        label="Rekomendasi Serupa"
        type={productType}
        contents={recomendationData}
        isLoading={isLoading}
      />
    </main>
  );
}

MainTemplateLayout.propTypes = {
  productType: PropTypes.oneOf(['podcast', 'ebook', 'comic']).isRequired,
  productDetail: PropTypes.object.isRequired,
  productEpisode: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  currentlyPlaying: PropTypes.object,
  handlePlayPodcast: PropTypes.func,
  handlePayment: PropTypes.func,
  handleSubscribe: PropTypes.func,
  topContentData: PropTypes.array.isRequired,
  recomendationData: PropTypes.array.isRequired,
};
