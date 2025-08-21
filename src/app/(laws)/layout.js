/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";
import Navbar from "@/components/Navbar/page";
import Footer from "@/components/Footer/MainFooter";

export default function LawsLayout({ children }) {
    return (
        <div className="flex flex-col overflow-x-hidden">
            <div className="flex flex-col">{children}</div>
        </div>
    );
}
