/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/page";
import Footer from "@/components/Footer/MainFooter";

export default function ContentLayout({ children }) {
    const pathname = usePathname();
    const hideLayout = pathname.startsWith("/comic/read") || pathname.startsWith("/ebook/read");

    return (
        <div className="flex flex-col overflow-x-hidden">
            {!hideLayout && <Navbar />}
            <div className="flex flex-col">{children}</div>
            {!hideLayout && <Footer />}
        </div>
    );
}
