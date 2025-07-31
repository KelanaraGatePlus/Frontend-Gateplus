/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";
import HeaderUploadForm from '@/components/UploadForm/HeaderUploadForm';
import HeaderTab from '@/components/UploadForm/HeaderTab';

export default function UploadEbookLayout({ children }) {

    return (
        <main className="mt-16 flex flex-col py-2 md:mt-[100px] lg:px-4">
            <HeaderUploadForm title={"Upload Ebook"} />
            <HeaderTab type={"ebooks"} />
            
            <div className="flex w-full flex-col px-2 mt-4">
                {children}
            </div>
        </main>
    );
}
