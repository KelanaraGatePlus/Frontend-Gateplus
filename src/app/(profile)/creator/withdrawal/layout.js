/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";

import HeaderUploadForm from "@/components/UploadForm/HeaderUploadForm";

export default function WithdrawalLayout({ children }) {

    return (
        <main className="flex flex-col py-2 lg:px-16">
            <div className="flex w-full mt-16 flex-col px-2 md:mt-[100px]">
                <HeaderUploadForm title={"Penarikan Dana"} />
                {children}
            </div>
        </main>
    );
}
