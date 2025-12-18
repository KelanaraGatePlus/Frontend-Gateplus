import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import PropTypes from "prop-types";

export default function EpisodeController(
    {
        nextEpisodeUrl = null,
        prevEpisodeUrl = null,
    }
) {
    return (
        <div className="grid grid-cols-2 w-full h-full justify-between items-center gap-3">
            <Link
                href={prevEpisodeUrl === null ? '' : prevEpisodeUrl}
                aria-disabled={prevEpisodeUrl === null}
                className={`bg-[#515151]/30 text-[16px] md:text-lg xl:text-2xl text-[#F5F5F5] zeinFont font-bold flex flex-row rounded-lg items-center justify-center gap-2 px-4 py-3 transition-colors ${prevEpisodeUrl === null
                    ? 'opacity-50 cursor-not-allowed pointer-events-none'
                    : 'hover:bg-[#4a4a4a]'
                    }`}
            >
                <Icon
                    icon={'material-symbols:arrow-left-alt-rounded'}
                    className="w-6 h-6"
                />
                {prevEpisodeUrl === null ? 'Belum Tersedia' : 'Episode Sebelumnya'}
            </Link>
            <Link
                href={nextEpisodeUrl === null ? '' : nextEpisodeUrl}
                aria-disabled={nextEpisodeUrl === null}
                className={`bg-[#515151]/30 text-[16px] md:text-lg xl:text-2xl text-[#F5F5F5] zeinFont font-bold flex flex-row rounded-lg items-center justify-center gap-2 px-4 py-3 transition-colors ${nextEpisodeUrl === null
                    ? 'opacity-50 cursor-not-allowed pointer-events-none'
                    : 'bg-[#515151] hover:bg-[#4a4a4a]'
                    }`}
            >
                {nextEpisodeUrl === null ? 'Selesai' : 'Episode Selanjutnya'}
                {nextEpisodeUrl !== null && <Icon
                    className="w-6 h-6"
                    icon={'material-symbols:arrow-right-alt-rounded'}
                />}
            </Link>
        </div>
    )
}

EpisodeController.propTypes = {
    nextEpisodeUrl: PropTypes.string,
    prevEpisodeUrl: PropTypes.string,
}