import React from 'react';
import Link from "next/link";
import Image from "next/image";
import ArrowRight from "@@/icons/icons-arrow-right.svg";
import PropTypes from 'prop-types';
import { usePathname } from 'next/navigation';

export default function HeaderTab({ type }) {
    const pathname = usePathname();
    const isStep1 = pathname.endsWith('/upload');
    const isStep2 = pathname.endsWith('/episode');

    return (
        <section className="mb-4 flex flex-row items-center justify-center gap-3">
            {/* STEP 1 */}
            <div className="flex flex-row items-center justify-center gap-1 rounded-full">
                <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-2xl font-extrabold ${isStep1 ? 'bg-[#1DBDF580] text-white' : 'bg-white/25 text-[#979797]'
                        }`}
                >
                    1
                </span>
                <span
                    className={`gap-1.5 text-xl font-bold ${isStep1 ? 'text-[#1DBDF580]' : 'text-[#979797]'
                        }`}
                >
                    <Link href={`/${type}/upload`}>Series</Link>
                </span>
            </div>

            {/* Arrow */}
            <div>
                <Image src={ArrowRight} alt="arrow-right" />
            </div>

            {/* STEP 2 */}
            <div className="flex flex-row items-center gap-1 rounded-full">
                <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-2xl font-extrabold ${isStep2 ? 'bg-[#1DBDF580] text-white' : 'bg-white/25 text-[#979797]'
                        }`}
                >
                    2
                </span>
                <span
                    className={`gap-1.5 text-xl font-bold ${isStep2 ? 'text-[#1DBDF580]' : 'text-[#979797]'
                        }`}
                >
                    <Link href={`/${type}/upload/episode`}>Episode</Link>
                </span>
            </div>
        </section>
    );
}

HeaderTab.propTypes = {
    type: PropTypes.string,
}