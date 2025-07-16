import React from 'react';
import PropTypes from 'prop-types';

import { Pagination } from 'flowbite-react';
import MenuTabs from './MenuTabs';
import ContentItem from '../ContentItem';

export default function UserLibraryTabs({
    datas,
    switchTab,
    currentPage,
    onChangePage,
    handleSwitchTab,
}) {
    return (
        <div className="mb-4 flex flex-1 flex-col px-0">
            {/* menu */}
            <MenuTabs switchTab={switchTab} handleSwitchTab={handleSwitchTab} />
            {/* content */}
            <div className="lg:x-0 grid grid-cols-3 justify-items-center gap-2 py-2 sm:grid-cols-4 lg:grid-cols-5 lg:gap-4 lg:pt-4">
                {datas.map((data, index) => (
                    <ContentItem
                        key={index}
                        item={data}
                        type={"ebook"}
                    />
                ))}
            </div>

            {/* pagination */}
            <Pagination
                className="flex justify-center"
                currentPage={currentPage}
                totalPages={10}
                onPageChange={onChangePage}
                alt="pagination"
            />
        </div>
    )
}

UserLibraryTabs.propTypes = {
    datas: PropTypes.array.isRequired,
    switchTab: PropTypes.string.isRequired,
    currentPage: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    handleSwitchTab: PropTypes.func.isRequired
}