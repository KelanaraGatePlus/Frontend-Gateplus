/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";

export default function ProfileLayout({ children }) {

    return (
        <main className="flex flex-col">
            <div className="flex w-full flex-col">
                {children}
            </div>
        </main>
    );
}
