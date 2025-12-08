/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";

export default function WithdrawalLayout({ children }) {

    return (
        <main className="flex flex-col py-2 lg:px-16">
            <div className="flex w-full flex-col px-2">

                {children}
            </div>
        </main>
    );
}
