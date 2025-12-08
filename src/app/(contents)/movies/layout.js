/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";

export default function UploadEbookLayout({ children }) {

    return (
        <main className="relative flex flex-col">
            <div className="flex w-full flex-col">
                {children}
            </div>
        </main>
    );
}
