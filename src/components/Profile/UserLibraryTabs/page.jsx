"use client";
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import useSyncUserData from "@/hooks/api/useSyncUserData";
import getMinAge from "@/lib/helper/minAge";

/*[--- HOOKS IMPORT ---]*/
import {
  useGetUserLastWatchedContentQuery,
  useGetUserPurchasedContentQuery,
  useGetUserSavedContentQuery,
} from "@/hooks/api/userSliceAPI";

import { Pagination } from "flowbite-react";
import MenuTabs from "./MenuTabs";
import ContentList from "../ContentList";

export default function UserLibraryTabs() {
  const [switchTab, setSwitchTab] = useState("Disimpan");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalItems, setTotalItems] = useState(0);
  const [activeContent, setActiveContent] = useState([]);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  const {
    data,
    isLoading: isLoadingSavedContent,
  } = useGetUserSavedContentQuery();
  const { data: lastWatchedData, isLoading: isLoadingLastWatched } =
    useGetUserLastWatchedContentQuery();
  const { data: purchasedData, isLoading: isLoadingPurchased } =
    useGetUserPurchasedContentQuery();

  const userSavedContentData = data?.data?.data || [];
  const userLastWatchedContentData = lastWatchedData?.data?.data || [];
  const userPurchasedContentData = purchasedData?.data?.data || [];

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

  // tab konten
  useEffect(() => {
    let content = [];
    let isLoading = false;

    if (switchTab === "Disimpan") {
      content = userSavedContentData;
      isLoading = isLoadingSavedContent;
    } else if (switchTab === "Dibeli") {
      content = userPurchasedContentData;
      isLoading = isLoadingPurchased;
    } else if (switchTab === "Riwayat Tonton") {
      content = userLastWatchedContentData;
      isLoading = isLoadingLastWatched;
    }

    setActiveContent(content);
    setIsLoadingContent(isLoading);
    setTotalItems(content.length);
    setCurrentPage(1);
  }, [
    switchTab,
    userSavedContentData,
    userPurchasedContentData,
    userLastWatchedContentData,
    isLoadingSavedContent,
    isLoadingPurchased,
    isLoadingLastWatched,
  ]);

  const handleSwitchTab = (tab) => {
    setSwitchTab(tab);
  };

  return (
    <div className="relative mb-4 flex flex-1 flex-col gap-4 px-0">
      <MenuTabs switchTab={switchTab} handleSwitchTab={handleSwitchTab} />

      <ContentList
        data={activeContent}
        isLoading={isLoadingContent}
        isOnUserProfile={true}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isBlurred={isBlurred}
      />

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
    </div>
  );
}

UserLibraryTabs.propTypes = {
  id: PropTypes.string.isRequired,
};
