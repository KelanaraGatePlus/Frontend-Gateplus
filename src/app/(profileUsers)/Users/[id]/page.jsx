/* eslint-disable react/react-in-jsx-scope */
"use client";
import Footer from "@/components/Footer/MainFooter";
import Navbar from "@/components/Navbar/page";
import BackPage from "@/components/BackPage/page";
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

  useEffect(() => {
    if (isSuccess && userDetailData) {
      const storedUserId = localStorage.getItem("users_id");
      setIsOwnProfile(storedUserId === id);
    }
  }, [isSuccess, userDetailData]);

  return (
    <div className="flex w-full flex-col">
      <Navbar />

      <main className="mt-16 flex w-full flex-col md:mt-24 px-2 lg:px-6">
        <BackPage />
        <div className="flex w-full flex-col md:flex-row md:gap-5">
          <ProfileCard
            data={userDetailData}
            profileFor="user"
            isLoading={isLoading}
            isOwnProfile={isOwnProfile}
          />

          <UserLibraryTabs id={id} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

UserProfilePage.propTypes = {
  params: PropTypes.string.isRequired,
}