import React from "react";
import { contentType } from "@/lib/constants/contentType";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";

export default function PodcastUniqueCard({
  title,
  id,
  coverUrl,
  creatorName,
  releaseDate,
  isBlurred,
  minAge,
}) {
  const formattedDate = new Date(releaseDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/${contentType.podcasts.pluralName}/detail/${id}`}
      className="ml-2 flex h-full w-full flex-col"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        {/* logic blur */}
        {isBlurred && minAge && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 backdrop-blur-md">
            <span className="pointer-events-auto rounded-lg bg-red-600 px-4 py-2 text-sm font-black text-white shadow-sm">
              {minAge}+
            </span>
          </div>
        )}

        <Image
          src={coverUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      {/* Bagian Teks */}
      <div className="relative z-20 mt-1 w-full flex-shrink-0 rounded-b-lg text-start">
        <h1 className="zeinFont line-clamp-1 text-sm font-bold text-white md:text-lg">
          {title}
        </h1>
        <p className="line-clamp-1 text-xs text-[#808080]">{creatorName}</p>
        <p className="line-clamp-1d mt-0.5 text-xs text-[#808080] md:mt-2">
          {formattedDate}
        </p>
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
  isBlurred: PropTypes.bool,
  minAge: PropTypes.number,
};
