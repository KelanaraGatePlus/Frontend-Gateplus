import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';

/*[--- CONSTANT IMPORT ---]*/
import { categoryIcons } from "@/lib/constants/categoryIcons";

export default function ContentItem({ item, type }) {

    return (
        <div className="overflow-hidden grow-0 group relative h-[180px] w-[120px] cursor-pointer rounded-lg sm:h-[200px] sm:w-[140px] md:h-[320px] md:w-[230px] group">
            <Link href={`/${type.toLowerCase()}/detail/${item.id}`}>
                <div className="relative h-full w-full">
                    <>
                        <div className="bottom-0 right-0 rounded-tl-full bg-opacity-60 absolute z-10 bg-[#02536e] px-2 py-1 text-xs text-white h-[18%] md:h-[20%] w-[30%] drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] flex items-center justify-center">
                            <div className="relative w-full h-full">
                                <Image
                                    priority
                                    width={45}
                                    height={45}
                                    src={categoryIcons[type]}
                                    alt={type}
                                    className="bg-[#222222] rounded-full p-1 absolute bottom-0 md:right-0 -right-0.5"
                                />
                            </div>
                        </div>
                        <div className="absolute  flex left-0  items-center justify-center h-fit w-full -bottom-12 group-hover:bottom-2 transition-all duration-300 ease-in-out">
                            <div className="rounded-2xl py-2 bg-opacity-60 w-[95%] z-10 bg-[#02536e]/30 backdrop-blur-2xl px-2 text-xs text-white h-fit drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] flex items-center justify-center">
                                <div className="relative w-full h-full flex items-center justify-start gap-2 md:pr-2">
                                    <div className="relative w-[18px] h-[18px] md:w-[25px] md:h-[25px] shrink-0">
                                        <Image
                                            priority
                                            src={categoryIcons[type]}
                                            alt={type}
                                            fill
                                            className="bg-[#222222] p-1 rounded-full object-contain"
                                        />
                                    </div>
                                    <p className="font-semibold montserratFont text-[8px] md:text-base line-clamp-1">
                                        {item.title}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                    <Image
                        src={type === "podcast" ? item.coverPodcastImage : item.coverImageUrl}
                        priority
                        width={240}
                        height={353}
                        alt={item.title || "podcast-image"}
                        unoptimized
                        className={`h-full w-full rounded-lg bg-[#2E2E2E] object-cover group-hover:opacity-50 transition-all duration-300 ease-in-out`}
                    />
                </div>
            </Link>
        </div>
    )
}

ContentItem.propTypes = {
    item: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
}