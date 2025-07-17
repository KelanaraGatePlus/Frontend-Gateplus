import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/*[--- HOOKS IMPORT ---]*/
import { useGetUserSavedContentQuery } from "@/hooks/api/userSliceAPI";

import { Pagination } from 'flowbite-react';
import MenuTabs from './MenuTabs';
import ContentList from '../ContentList';

export default function UserLibraryTabs({ id }) {
    const [switchTab, setSwitchTab] = useState("Disimpan");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [totalItems, setTotalItems] = useState(0);
    const [activeContent, setActiveContent] = useState([]);
    const [isLoadingContent, setIsLoadingContent] = useState(false);

    const { data, isLoading: isLoadingSavedContent, isSuccess } = useGetUserSavedContentQuery(id);
    const userSavedContentData = data?.data?.data || [];

    useEffect(() => {
        if (isSuccess && userSavedContentData) {
            setTotalItems(userSavedContentData.length);
        }
    }, [isSuccess, userSavedContentData]);

    useEffect(() => {
        let content = [];
        let isLoading = false;

        if (switchTab === "Disimpan") {
            content = userSavedContentData;
            isLoading = isLoadingSavedContent;
        } else if (switchTab === "Dibeli") {
            content = [];
            isLoading = false;
        } else if (switchTab === "Riwayat Tonton") {
            const local = localStorage.getItem("last_seen_content");
            content = local ? JSON.parse(local) : [];
            isLoading = false;
        }

        setActiveContent(content);
        setIsLoadingContent(isLoading);
        setTotalItems(content.length);
    }, [switchTab, userSavedContentData]);

    const handleSwitchTab = (tab) => {
        setSwitchTab(tab);
    };

    return (
        <div className="mb-4 flex flex-1 flex-col px-0 gap-4 relative">
            <MenuTabs switchTab={switchTab} handleSwitchTab={handleSwitchTab} />
            <ContentList
                data={activeContent}
                isLoading={isLoadingContent}
                isOnUserProfile={true}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
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
    )
}

UserLibraryTabs.propTypes = {
    id: PropTypes.string.isRequired,
}