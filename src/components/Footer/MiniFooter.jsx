import React from "react";
import Link from "next/link";

/*[--- CONSTANTS IMPORT ---]*/
import { siteMetadata } from '@/lib/constants/siteMetaData';

export default function MiniFooter() {
    return (
        <section className="mx-5 mb-6 flex flex-col items-center gap-2 md:mt-0 md:block lg:mb-2">
            <div className="flex self-auto text-white md:hidden">{siteMetadata.copyright}</div>
            <div className="flex flex-row justify-center gap-2 text-white">
                <div className="hidden md:flex">{siteMetadata.copyright}</div>
                <p className="hidden md:flex">|</p>
                <div className="text-center text-blue-700 underline">
                    <Link href={siteMetadata.legalLinks[0].href}>{siteMetadata.legalLinks[0].name}</Link>
                </div>
                <p>|</p>
                <div className="text-center text-blue-700 underline">
                    <Link href={siteMetadata.legalLinks[1].name}>{siteMetadata.legalLinks[1].name}</Link>
                </div>
                <p>|</p>
                <div className="text-center text-blue-700 underline">
                    <Link href={siteMetadata.legalLinks[2].href}>{siteMetadata.legalLinks[2].name}</Link>
                </div>
            </div>
        </section>
    );
}
