import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import PropTypes from "prop-types";

/*[--- CONSTANT IMPORT ---]*/
import { imageDefaultValue } from "@/lib/constants/imageDefaultValue";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

/*[--- COMPONENT IMPORT ---]*/
import PersonalInformationSection from "./PersonalInformation/page";
import Toast from "@/components/Toast/page";
import ProfileCardLoading from "@/components/Profile/ProfileCard/ProfileCardLoading";

export default function ProfileCard({
  data,
  profileFor,
  totalSubs = 0,
  isLoading,
  isReady = true,
  isOwnProfile,
  isLinkedWithGoogle = false,
  isFollowed = false,
  setTotalSubs = () => {},
}) {
  const [isSubscribed, setIsSubscribed] = useState(isFollowed);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const bio =
    data?.bio && data.bio !== "null"
      ? data.bio
      : data?.user?.bio && data.user.bio !== "null"
        ? data.user.bio
        : "";

  // Sinkronisasi state dengan prop isFollowed
  useEffect(() => {
    setIsSubscribed(isFollowed);
  }, [isFollowed]);

  const handleToggleSubscribe = async () => {
    if (isSubscribed) {
      setShowToast(true);
      return null;
    }
    try {
      setIsSubscribing(true);
      const userId = localStorage.getItem("users_id");
      const creatorId = data.id;
      const response = await axios.post(`${BACKEND_URL}/subscribers`, {
        userId: userId,
        creatorId: creatorId,
      });
      setTotalSubs(totalSubs + 1);
      console.log(response.data);
      setIsSubscribed(true);
    } catch (error) {
      console.error(error);
      window.location.href = "/login";
    } finally {
      setIsSubscribing(false);
    }
  };

  if (!isReady || isLoading) {
    return <ProfileCardLoading profileFor={profileFor} />;
  }

  // console.log(data); muncul di console browser bang data user
  return (
    <>
      <div className="relative mt-1 z-20 flex h-fit w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-500 bg-[#FFFFFF1A] p-4 backdrop-blur-lg transition-all duration-300 ease-out md:max-w-[300px] md:min-w-[300px]">
        {profileFor === "creator" && (
          <section className="absolute top-0 mb-2 h-36 w-full overflow-hidden md:hidden md:h-32 lg:w-full">
            {data?.bannerImageUrl && data?.bannerImageUrl !== "null" ? (
              <Image
                priority
                src={data?.bannerImageUrl}
                alt="banner-creator"
                fill
                className="object-cover object-center"
              />
            ) : (
              <Image
                priority
                src={imageDefaultValue.creator.bannerImageUrl}
                alt="banner-creator"
                fill
                className="object-cover object-top"
              />
            )}
          </section>
        )}

        {/* Profile */}
        <div className="z-0 mt-8 mb-2 h-32 w-32 shrink-0 rounded-full shadow-2xl transition-all duration-300 ease-out md:mt-2 md:h-36 md:w-36">
          {data?.imageUrl && data?.imageUrl !== "null" ? (
            <Image
              priority
              className="h-full w-full rounded-full bg-[#2e2e2e] object-cover"
              src={data.imageUrl}
              width={128}
              height={128}
              alt="logo-usercomment"
            />
          ) : (
            <Image
              priority
              className="h-full w-full rounded-full bg-[#2e2e2e] object-cover"
              src={imageDefaultValue.creator.imageUrl}
              width={128}
              height={128}
              alt="logo-defaultuser"
            />
          )}
        </div>

        {/* personal information */}
        {data && (
          <PersonalInformationSection
            data={{ ...data, bio }}
            totalSubsribers={totalSubs}
            profileFor={profileFor}
            isOwnProfile={isOwnProfile}
            isSubscribed={isSubscribed}
            isSubsribing={isSubscribing}
            handleToggleSubscribe={handleToggleSubscribe}
            isLinkedWithGoogle={isLinkedWithGoogle}
          />
        )}
      </div>
      {showToast && (
        <Toast
          message={`Untuk saat ini belum bisa Unsubscribe Creator (${data.profileName})`}
          type="failed"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}

ProfileCard.propTypes = {
  data: PropTypes.object.isRequired,
  profileFor: PropTypes.oneOf(["creator", "user"]).isRequired,
  totalSubs: PropTypes.number,
  isLoading: PropTypes.bool.isRequired,
  isReady: PropTypes.bool,
  isOwnProfile: PropTypes.bool.isRequired,
  setTotalSubs: PropTypes.func,
  isLinkedWithGoogle: PropTypes.bool,
  isFollowed: PropTypes.bool,
};
