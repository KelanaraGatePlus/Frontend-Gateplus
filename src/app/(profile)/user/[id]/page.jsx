/* eslint-disable react/react-in-jsx-scope */
"use client";
import BackButton from "@/components/BackButton/page";
import PropTypes from "prop-types";
import { use, useEffect, useState } from "react";
import ProfileCard from "@/components/Profile/ProfileCard/ProfileCard";
import UserLibraryTabs from "@/components/Profile/UserLibraryTabs/page";

/*[--- HOOKS IMPORT ---]*/
import { useGetUserDetailQuery } from "@/hooks/api/userSliceAPI";

export default function UserProfilePage({ params }) {
  const { id } = use(params);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { data, isLoading, isSuccess } = useGetUserDetailQuery(id);
  const userDetailData = data?.data?.data;
  const isLinkedWithGoogle = userDetailData?.googleId ? true : false;

  useEffect(() => {
    if (isSuccess && userDetailData) {
      const storedUserId = localStorage.getItem("users_id");
      setIsOwnProfile(storedUserId === id);
    }
  }, [isSuccess, userDetailData]);

  return (
    <main className="mt-16 flex w-full flex-col md:mt-24 px-2 lg:px-6">
      <BackButton />
      <div className="flex w-full flex-col md:flex-row md:gap-5">
        <ProfileCard
          data={userDetailData}
          profileFor="user"
          isLoading={isLoading}
          isOwnProfile={isOwnProfile}
          isLinkedWithGoogle={isLinkedWithGoogle}
        />

        <UserLibraryTabs id={id} />
      </div>
    </main>
  );
}

UserProfilePage.propTypes = {
  params: PropTypes.string.isRequired,
}