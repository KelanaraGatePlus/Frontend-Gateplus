"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import PropTypes from "prop-types";

/*--- HOOKS IMPORT ---*/
import { useGetCreatorDetailQuery } from "@/hooks/api/creatorSliceAPI";
import { useGetNewestContentQuery } from "@/hooks/api/creatorSliceAPI";
import useSyncUserData from "@/hooks/api/useSyncUserData";

/*--- COMPONENT IMPORT ---*/
import ProfileCard from "@/components/Profile/ProfileCard/ProfileCard";
import CreatorMostViewedContent from "@/components/Carousel/CarouselProfile/creatorMostViewedContent";
import BackButton from "@/components/BackButton/page";
import Skeleton from "react-loading-skeleton";
import { Pagination } from "flowbite-react";
import "react-loading-skeleton/dist/skeleton.css";

/*--- CONSTANT IMPORT ---*/
import { imageDefaultValue } from "@/lib/constants/imageDefaultValue";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";
import getMinAge from "@/lib/helper/minAge";

export default function CreatorProfilePage({ params }) {
  const { id } = params;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalItems, setTotalItems] = useState(0);
  const [userId, setUserId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [totalSubs, setTotalSubs] = useState(0);
  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const [isLinkedWithGoogle, setIsLinkedWithGoogle] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("users_id");
      setUserId(storedUserId);
      setIsReady(true);
    }
  }, []);

  const skip = !id || !userId;
  const creatorDetailQuery = useGetCreatorDetailQuery({ id, userId }, { skip });
  const creatorContentNewestQuery = useGetNewestContentQuery(id);
  const creatorDetailData = creatorDetailQuery.data?.data?.data;
  const creatorContentNewestData =
    creatorContentNewestQuery.data?.data?.data || [];

  useEffect(() => {
    if (creatorDetailQuery.isSuccess && creatorDetailData) {
      setBannerImageUrl(creatorDetailData.bannerImageUrl);
      setTotalSubs(creatorDetailData.totalSubscribers);
      const storedCreatorId = localStorage.getItem("creators_id");
      setIsOwnProfile(storedCreatorId === id);
      setIsLinkedWithGoogle(!!creatorDetailData.user.googleId);
      setIsSubscribed(creatorDetailData.isSubscribed ?? false);
    }
  }, [creatorDetailQuery.isSuccess, creatorDetailData, id]);

  useEffect(() => {
    if (creatorContentNewestQuery.isSuccess && creatorContentNewestData) {
      setTotalItems(creatorContentNewestData.length);
    }
  }, [creatorContentNewestQuery.isSuccess, creatorContentNewestData]);

  const { userAge, isReady: isUserReady } = useSyncUserData();

  // blur
  const isBlurred = useCallback(
    (content) => {
      if (!isUserReady) return true;

      const minAge = getMinAge(content?.ageRestriction);
      if (minAge === null) return false;

      if (userAge == null) return true;

      return userAge < minAge;
    },
    [userAge, isUserReady],
  );

  return (
    <main className="relative mx-2 flex flex-col lg:mx-6">
      <BackButton />
      {creatorDetailQuery.isLoading ? (
        <section className="absolute top-1 -z-10 mb-2 hidden h-36 w-full overflow-hidden rounded-xl md:block md:h-64 lg:w-full">
          <Skeleton
            height="100%"
            width="100%"
            borderRadius="0.75rem"
            baseColor="#2e2e2e"
            highlightColor="#3d3d3d"
          />
        </section>
      ) : (
        <section className="absolute top-1 -z-10 mb-2 hidden h-36 w-full overflow-hidden rounded-xl bg-[#2e2e2e] md:block md:h-64 lg:w-full">
          <Image
            priority
            src={
              bannerImageUrl && bannerImageUrl !== "null"
                ? bannerImageUrl
                : imageDefaultValue.creator.bannerImageUrl
            }
            alt="banner-creator"
            fill
            className="object-cover object-center"
          />
        </section>
      )}

      <div className="flex w-full flex-col items-start gap-2 transition-all duration-300 ease-out md:mt-32 md:flex-row md:items-end">
        <ProfileCard
          data={creatorDetailData}
          profileFor="creator"
          totalSubs={totalSubs}
          isLoading={creatorDetailQuery.isLoading}
          isReady={isUserReady}
          isOwnProfile={isOwnProfile}
          setTotalSubs={setTotalSubs}
          isLinkedWithGoogle={isLinkedWithGoogle}
          isFollowed={isSubscribed ?? false}
        />
        <section className="w-full transition-all duration-300 ease-out md:max-w-[calc(100%-300px)] md:min-w-[calc(100%-300px)]">
          <CreatorMostViewedContent creatorId={id} isBlurred={isBlurred} />
        </section>
      </div>

      {/* Baru ditambahkan */}
      <section className="md:mt-8">
        <CarouselTemplate
          label="Baru ditambahkan"
          contents={creatorContentNewestData.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage,
          )}
          isLoading={false}
          isTopTen={false}
          isOnCreatorProfile={true}
          isBlurred={isBlurred}
        />
      </section>

      <section className="mx-5 mt-10 flex justify-center">
        {totalItems > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(totalItems / itemsPerPage))}
            onPageChange={(page) => setCurrentPage(page)}
            showIcons
          />
        )}
      </section>
    </main>
  );
}

CreatorProfilePage.propTypes = {
  params: PropTypes.string.isRequired,
};
