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
  const itemsPerPage = 4;
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
    } else if (switchTab === "Riwayat") {
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

      <section className="mt-2 flex justify-center w-full">
        {totalItems > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(totalItems / itemsPerPage))}
            onPageChange={(page) => setCurrentPage(page)}
            showIcons
            theme={{
              pages: {
                base: "inline-flex items-center -space-x-px",
                showIcon: "inline-flex",
                previous: {
                  base: "ml-0 rounded-l-lg border border-[#0E5BA8] bg-[#E7F0FF] px-3 py-2 leading-tight text-[#0E5BA8] hover:bg-[#0E5BA8] hover:text-white",
                  icon: "h-5 w-5",
                },
                next: {
                  base: "rounded-r-lg border border-[#0E5BA8] bg-[#E7F0FF] px-3 py-2 leading-tight text-[#0E5BA8] hover:bg-[#0E5BA8] hover:text-white",
                  icon: "h-5 w-5",
                },
                selector: {
                  base: "w-10 border border-[#0E5BA8] bg-[#E7F0FF] py-2 leading-tight text-[#0E5BA8] hover:bg-[#0E5BA8] hover:text-white",
                  active: "bg-[#0E5BA8] text-white hover:bg-[#0b4a86]",
                },
              },
            }}
          />
        )}
      </section>
    </div>
  );
}

UserLibraryTabs.propTypes = {
  id: PropTypes.string.isRequired,
};
