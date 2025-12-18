/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";
import HeaderTab from '@/components/UploadForm/HeaderTab';
import HeaderUploadForm from '@/components/UploadForm/HeaderUploadForm';

export default function UploadEbookLayout({ children }) {

    return (
        <main className="flex flex-col py-2 lg:px-4">
            <HeaderUploadForm title={"Upload Series"} />
            <HeaderTab type={"series"} />

            <div className="flex w-full flex-col px-2 mt-4">
                {children}
            </div>
        </main>
    );
}
