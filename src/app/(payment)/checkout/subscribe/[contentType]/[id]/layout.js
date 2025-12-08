"use client";
import React from "react";
import PropTypes from "prop-types";

export default function CheckoutPageLayout({ children }) {
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

CheckoutPageLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
