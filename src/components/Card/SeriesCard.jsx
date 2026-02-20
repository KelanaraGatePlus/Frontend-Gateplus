import React from "react";
import { contentType } from "@/lib/constants/contentType";
import Image from "next/image";
import Link from "next/link";
// import logoSave from "@@/logo/logoDetailFilm/save-icons.svg";
import logoGateplusWhite from "@@/logo/logoGate+/logo-gateplus-white.svg";
import blur from "@@/poster/blur.svg";
// import iconMore from "@@/icons/icon_more.svg";
import PropTypes from "prop-types";

export default function SeriesCard({
  title,
  id,
  coverUrl,
  rank = null,
  isOriginal = false,
  hasNewEpisode = false,
  withTopTag = true,
  withNewestTag = false,
  progress = 0,
  customHref,
}) {
  const href = customHref || `/${contentType.series.pluralName}/detail/${id}`;

  return (
    <Link href={href} className="block h-full w-full">
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[6px] bg-transparent">
        <div className="relative w-full" style={{ paddingBottom: "140%" }}>
          <div className="absolute inset-0 overflow-hidden rounded-t-[6px]">
            {/* Banner Atas */}
            <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between px-2 py-1">
              <div className="flex flex-row items-start gap-1 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                {withTopTag && rank && (
                  <div className="zeinFont flex flex-col items-center rounded-sm bg-[#22222233] px-4 py-1 font-black text-cyan-400 backdrop-blur-xs">
                    <span className="text-sm">Teratas</span>
                    <span className="text-3xl">{rank || 1}</span>
                  </div>
                )}
                {withNewestTag && (
                  <span className="zeinFont rounded-sm bg-[#22222233] px-2 text-sm font-semibold text-cyan-200 backdrop-blur-xs">
                    Baru
                  </span>
                )}
                {hasNewEpisode && (
                  <span className="zeinFont rounded-sm bg-[#22222233] px-1.5 py-[3px] text-[12px] font-medium text-cyan-200 backdrop-blur-xs">
                    Episode Baru
                  </span>
                )}
              </div>
            </div>

            {/* Konten Bawah */}
            <div className="absolute right-0 bottom-0 left-0 z-20 flex items-center justify-between px-1">
              {/* series icon → selalu tampil */}
              <Image
                priority
                width={45}
                height={45}
                src={contentType.series.icon}
                alt="series-icon"
                className="drop-shadow-lg"
              />

              {/* Text "Original" → muncul saat hover */}
              {isOriginal && (
                <div className="flex items-center self-end rounded-sm bg-[#22222233] px-2 py-1 text-white backdrop-blur-xs">
                  <Image
                    priority
                    width={18}
                    height={18}
                    src={logoGateplusWhite}
                    alt="logo-gateplus-white"
                    className="mr-1"
                  />
                  <p className="zeinFont text-xs">Original</p>
                </div>
              )}

              {/* Bookmark icon → hanya muncul saat hover
                    <Image
                        priority
                        width={28}
                        height={28}
                        src={logoSave}
                        alt="save-icon"
                        className="drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                    /> */}
            </div>

            {/* Poster */}
            <Image
              src={coverUrl}
              priority
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={title || "series-image"}
              unoptimized
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />

            {/* Blur pojok kiri bawah */}
            <Image
              src={blur}
              priority
              width={14}
              height={14}
              alt="blur"
              className="absolute bottom-0 left-0 h-16 w-16"
            />
          </div>
        </div>

        {/* progress bar */}
        {progress > 0 && (
          <div className="mt-2 w-full">
            <div className="h-2 w-full overflow-hidden rounded-lg border border-white/30 bg-white/10">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

SeriesCard.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  coverUrl: PropTypes.string.isRequired,
  rank: PropTypes.number,
  isOriginal: PropTypes.bool,
  hasNewEpisode: PropTypes.bool,
  withTopTag: PropTypes.bool,
  withNewestTag: PropTypes.bool,
  progress: PropTypes.number,
  customHref: PropTypes.string,
};
