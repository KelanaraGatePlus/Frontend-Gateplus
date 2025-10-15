import React from "react";
import { contentType } from "@/lib/constants/contentType";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";

export default function PodcastUniqueCard({ title, id, coverUrl, creatorName, releaseDate }) {
    const formattedDate = new Date(releaseDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    return (
        <Link
            href={`/${contentType.podcasts.pluralName}/detail/${id}`}
            // Card ini tetap mengisi wadah dan menjadi flex column
            className="w-full h-full flex flex-col ml-2"
        >
            <div className="w-full relative aspect-square rounded-lg overflow-hidden">
                <Image
                    src={coverUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                />
            </div>

            <div className="w-full flex-shrink-0 mt-1 text-start rounded-b-lg">
                <h1 className="text-white font-bold line-clamp-1 zeinFont text-sm md:text-lg">
                    {title}
                </h1>
                <p className="text-[#808080] text-xs line-clamp-1">{creatorName}</p>
                <p className="text-[#808080] text-xs line-clamp-1d mt-0.5 md:mt-2">{formattedDate}</p>
            </div>
        </Link>
    );
}

PodcastUniqueCard.propTypes = {
    title: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    coverUrl: PropTypes.string.isRequired,
    creatorName: PropTypes.string.isRequired,
    releaseDate: PropTypes.string.isRequired,
};