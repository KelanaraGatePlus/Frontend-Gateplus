"use client";
import React from "react";
import PropTypes from "prop-types";

/*[--- COMPONENTS IMPORT ---]*/
import ProductDetailSection from "@/components/MainDetailProduct/ProductDetailSection";
import ProductEpisodeSection from "@/components/MainDetailProduct/ProductEpisodeSection";
import ProductDonationSection from "@/components/MainDetailProduct/ProductDonationSection";
import CarouselTemplate from "../Carousel/carouselTemplate";

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
  console.log("productDetail", productDetail);
  return (
    <main className="mt-16 flex flex-col md:mt-[100px]">
      <ProductDetailSection
        productType={productType}
        productID={productDetail.id}
        productBanner={productDetail.posterImageUrl}
        productCover={productType === 'podcast' ? productDetail.coverPodcastImage : productDetail.coverImageUrl}
        productTitle={productDetail.title}
        productDescription={productDetail.description}
        productAgeRestriction={productDetail.ageRestriction}
        productGenre={productDetail.categories?.tittle}
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
      />

      <div className="px-4 pmd:px-15">
        <ProductEpisodeSection
          productType={productType}
          productEpisodes={productEpisode}
          isLoading={isLoading}
          currentlyPlaying={currentlyPlaying}
          handlePlayPodcast={handlePlayPodcast}
          handlePayment={handlePayment}
          isSubscribe={productDetail?.isSubscribe && productDetail?.canSubscribe ? true : false}
          productId={productDetail?.id}
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
      <div className="px-15 mt-10 md:mt-20">
        <ProductDonationSection
          creatorId={productDetail?.creatorId}
        />
      </div>
    </main>
  );
}

MainTemplateLayout.propTypes = {
  productType: PropTypes.string.isRequired,
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
