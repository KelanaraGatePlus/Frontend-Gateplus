"use client";
import React from "react";
import PropTypes from "prop-types";

export default function HelpLayout({ children }) {
    return (
        <div className="flex flex-col overflow-x-hidden">
            <div className="flex flex-col">
                <main className="relative flex flex-col">
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
