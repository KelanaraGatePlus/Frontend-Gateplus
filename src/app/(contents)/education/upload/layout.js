/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";
import HeaderUploadForm from '@/components/UploadForm/HeaderUploadForm';

export default function UploadEbookLayout({ children }) {

    return (
        <main className="flex flex-col py-2 lg:px-16">
            <HeaderUploadForm title={"Upload Education"} />

            <div className="flex w-full flex-col mt-4">
                {children}
            </div>
        </main>
    );
}
