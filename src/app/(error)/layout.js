/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/page";
import Footer from "@/components/Footer/MainFooter";

export default function ErrorsLayout({ children }) {
    const pathname = usePathname();
    const showNavbarFooter = pathname.startsWith("/blank");

    return (
        <div className="flex flex-col overflow-x-hidden">
            {showNavbarFooter && <Navbar />}
            <div className="flex flex-col">{children}</div>
            {showNavbarFooter && <Footer />}
        </div>
    );
}
