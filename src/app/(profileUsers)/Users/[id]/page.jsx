/* eslint-disable react/react-in-jsx-scope */
"use client";
import Footer from "@/components/Footer/MainFooter";
import Navbar from "@/components/Navbar/page";
import BackPage from "@/components/BackPage/page";
import PropTypes from "prop-types";
import axios from "axios";
import { use, useEffect, useState } from "react";
import ProfileCard from "@/components/Profile/ProfileCard/ProfileCard";
import UserLibraryTabs from "@/components/Profile/UserLibraryTabs/page";

/*[--- HOOKS IMPORT ---]*/
import { useGetUserDetailQuery } from "@/hooks/api/userSliceAPI";

export default function UserProfilePage({ params }) {
  const { id } = use(params);
  const [currentPage, setCurrentPage] = useState(1);
  const [switchTab, setSwitchTab] = useState("RiwayatTonton");
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const userDetailQuery = useGetUserDetailQuery(id);
  const userDetailData = userDetailQuery.data?.data?.data;

  useEffect(() => {
    if (userDetailQuery.isSuccess && userDetailData) {
      const storedUserId = localStorage.getItem("users_id");
      setIsOwnProfile(storedUserId === id);
    }
  }, [userDetailQuery.isSuccess, userDetailData]);

  const onChangePage = (page) => setCurrentPage(page);
  const [savedEbooks, setSavedEbooks] = useState([]);
  const handleSwitchTab = (tab) => {
    setSwitchTab(tab);
  };

  const getDataByUserId = async () => {
    try {
      const userId = localStorage.getItem("users_id");
      const response = await axios.get(
        `http://localhost:3000/save/byUser/${userId}`,
      );
      const usersSavedEbook = response.data.data.data;

      const allEbooks = usersSavedEbook
        .flatMap((item) => item.users?.savedEpisode || [])
        .map((se) => se.ebook);

      setSavedEbooks(allEbooks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getDataByUserId();
  }, []);

  return (
    <div className="flex w-full flex-col">
      <Navbar />

      <main className="mt-16 flex w-full flex-col md:mt-24 px-2 lg:px-6">
        <BackPage />
        <div className="flex w-full flex-col md:flex-row md:gap-5">
          <ProfileCard
            data={userDetailData}
            profileFor="user"
            isLoading={userDetailQuery.isLoading}
            isOwnProfile={isOwnProfile}
          />

          <UserLibraryTabs
            datas={savedEbooks}
            switchTab={switchTab}
            currentPage={currentPage}
            onChangePage={onChangePage}
            handleSwitchTab={handleSwitchTab} />
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