"use client";
import React from 'react';
import PropTypes from 'prop-types';

export default function UploadEbookLayout({ children }) {

    return (
        <main className="relative mt-16 flex flex-col md:mt-[100px]">
            <div className="flex w-full flex-col">
                {children}
            </div>
        </main>
    );
}

UploadEbookLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
