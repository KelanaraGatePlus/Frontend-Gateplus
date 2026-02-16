import React from "react";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";

export default function ContentItem({ item, type, isBlurred }) {
  const blurred = isBlurred ? isBlurred(item) : false;

  // ambil umur
  const minAge = item?.ageRestriction ?? null;

  return (
    <div className="group relative h-[180px] w-[120px] grow-0 cursor-pointer overflow-hidden rounded-lg transition-all duration-300 sm:h-[200px] sm:w-[140px] md:h-[320px] md:w-[230px]">
      <Link href={`/${type.toLowerCase()}s/detail/${item.id}`}>
        <div className="relative h-full w-full">
          <Image
            src={
              type === "podcast" ? item.coverPodcastImage : item.coverImageUrl
            }
            priority
            width={240}
            height={353}
            alt={item.title || "image"}
            unoptimized
            className={`h-full w-full rounded-lg bg-[#2E2E2E] object-cover transition-all duration-300 ease-in-out group-hover:opacity-50`}
          />
          {blurred && minAge && (
            <div className="pointer-events-none absolute inset-0 z-10 rounded-lg">
              <div className="absolute inset-0 rounded-lg bg-black/20 backdrop-blur-sm" />
              <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                <span className="rounded-lg bg-red-600 px-4 py-2 text-sm font-black text-white">
                  {String(minAge).replace(/\D/g, "")}+
                </span>
              </div>
            </div>
          )}

          {/* Bottom info */}
          <div className="absolute right-0 bottom-0 left-0 rounded-b-lg bg-black/40 p-2 text-xs text-white md:text-sm">
            {item.title}
          </div>
        </div>
      </Link>
    </div>
  );
}

ContentItem.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  isBlurred: PropTypes.func, // harus diteruskan dari ContentList
};
