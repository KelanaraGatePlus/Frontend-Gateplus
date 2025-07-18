/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/page";
import Footer from "@/components/Footer/MainFooter";

export default function RootLayout({ children }) {
    const pathname = usePathname();
    const hideLayout = pathname.startsWith("/Comic/ReadComic") || pathname.startsWith("/Ebook/ReadEbook");

    return (
        <div className="flex flex-col overflow-x-hidden">
            {!hideLayout && <Navbar />}
            <div className="flex flex-col">{children}</div>
            {!hideLayout && <Footer />}
        </div>
    );
}
