"use client";
import React from "react";
import PropTypes from "prop-types";

/*[--- COMPONENTS IMPORT ---]*/
import Footer from "@/components/Footer/page";
import Navbar from "@/components/Navbar/page";
import ProductDetailSection from "@/components/template/ProductDetailSection";
import ProductEpisodeSection from "@/components/template/ProductEpisodeSection";
import ProductDonationSection from "@/components/template/ProductDonationSection";
import ProductCommentUnavailable from "@/components/template/ProductCommentUnavailable";
import CarouselItemEookPage from "@/components/Carousel/CarouselEbook/page";

export default function MainTemplateLayout({
  productType,
  productDetail,
  productEpisode,
}) {
  return (
    <div className="flex flex-col overflow-x-hidden">
      <Navbar />

      <main className="mt-16 flex flex-col md:mt-[100px]">
        {productDetail && (
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
            productIsSaved={productDetail.isSaved}
            productTotalViews={productDetail.totalViews}
            productTotalLikes={productDetail.totalLikes}
            creatorDetail={productType === 'podcast' ? productDetail.Creator : productDetail.creators}
            creatorTotalSubscriber={productDetail.totalCount}
            creatorIsSubscribed={productDetail.isSubscribed}
          />
        )}

        <ProductEpisodeSection
          productType={productType}
          productEpisodes={productEpisode}
        />

        <CarouselItemEookPage />
        <ProductDonationSection />
        <ProductCommentUnavailable />
      </main>

      <Footer />
    </div>
  );
}

MainTemplateLayout.propTypes = {
  productType: PropTypes.string.isRequired,
  productDetail: PropTypes.object.isRequired,
  productEpisode: PropTypes.array.isRequired,
};
