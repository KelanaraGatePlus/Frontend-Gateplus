/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";

export default function UploadEbookLayout({ children }) {

    return (
        <main className="relative mt-16 flex flex-col md:mt-[100px]">
            <div className="flex w-full flex-col">
                {children}
            </div>
        </main>
    );
}
