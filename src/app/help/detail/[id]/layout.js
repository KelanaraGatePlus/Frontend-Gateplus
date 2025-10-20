"use client";
import React from "react";
import PropTypes from "prop-types";

export default function ContentLayout({ children }) {
    return (
        <div className="flex flex-col overflow-x-hidden px-12">
            <div className="flex flex-col">
                <main className="flex flex-col py-2 lg:px-4">
                    {children}
                </main>
            </div>
        </div>
    );
}

ContentLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
