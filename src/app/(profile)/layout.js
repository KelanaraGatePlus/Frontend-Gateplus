/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";

export default function ProfileLayout({ children }) {
    return (
        <div className="flex flex-col overflow-x-hidden">
            <div className="flex flex-col">{children}</div>
        </div>
    );
}
