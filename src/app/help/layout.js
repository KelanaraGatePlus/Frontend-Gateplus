"use client";
import React from "react";
import PropTypes from "prop-types";

export default function HelpLayout({ children }) {
    return (
        <div className="flex flex-col overflow-x-hidden">
            <div className="flex flex-col">
                <main className="relative mt-16 flex flex-col md:mt-[100px]">
                    <div className="flex w-full flex-col">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

HelpLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
