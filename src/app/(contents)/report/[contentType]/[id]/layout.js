/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";

import HeaderUploadForm from "@/components/UploadForm/HeaderUploadForm";

export default function UploadEbookLayout({ children }) {

    return (
        <main className="mt-16 flex flex-col md:mt-[100px]">
            <div className="flex w-full flex-col">
                <div className="flex flex-col py-2 lg:px-16">
                    <HeaderUploadForm title={"Report Konten"} />

                    <div className="flex w-full flex-col px-2 mt-4">
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
}
