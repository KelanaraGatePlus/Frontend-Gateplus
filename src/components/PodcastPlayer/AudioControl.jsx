"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import PropTypes from "prop-types";

/*[--- ASSETS IMPORT ---]*/
import iconPlay from "@@/icons/icons-play.svg";
import iconPause from "@@/icons/icons-pause.svg";
import iconForward from "@@/icons/icons-forward.svg";
import iconBackward from "@@/icons/icons-backward.svg";
import iconNext10Seconds from "@@/icons/icons-next10sec.svg";
import iconBack10Seconds from "@@/icons/icons-back10sec.svg";
import iconExpand from "@@/icons/icons-expand.svg";
import iconCollapse from "@@/icons/icons-collapse.svg";
import iconComment from "@@/icons/icons-comment.svg";
import iconVolumeUp from "@@/icons/icons-volume-up.svg";
import iconVolumeDown from "@@/icons/icons-volume-down.svg";
import Link from "next/link";

export default function AudioControl({
    coverEpisodeUrl,
    title,
    creatorName,
    creatorId,
    currentTime,
    duration,
    volume,
    isPlay,
    isExpand,
    isCommentVisible,
    isMobile,
    handleSeekBackward,
    handleSeekForward,
    handlePlay,
    handlePrevEpisode,
    handleNextEpisode,
    handleExpand,
    handleViewComments,
    handleDecreaseVolume,
    handleVolumeChange,
    handleIncreaseVolume,
    handleSeek,
    hasPrevEpisodeAvailable,
    hasNextEpisodeAvailable,
}) {
    const [isVolumeVisible, setIsVolumeVisible] = useState(false);
    const volumeSliderRef = useRef(null);

    const toggleVolumeSlider = () => setIsVolumeVisible(!isVolumeVisible);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                volumeSliderRef.current &&
                !volumeSliderRef.current.contains(e.target)
            ) {
                setIsVolumeVisible(false);
            }
        };

        if (isVolumeVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isVolumeVisible]);

    return (
        <div>
            <div
                className={`flex relative w-full flex-col`}
            >
                <div className="absolute z-10 w-full -top-3">
                    <input
                        type="range"
                        name="track"
                        id="track"
                        className="w-full cursor-pointer appearance-none rounded-full accent-blue-500 h-2.5"
                        min={0}
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        style={{
                            background: `linear-gradient(to right, #1297DC ${(currentTime / (duration || 1)) * 100}%, #616161 ${(currentTime / (duration || 1)) * 100}%)`,
                        }}
                    />
                </div>
            </div>
            <div
                className={`${isMobile ? "pb-10" : "pb-0"} z-40 flex flex-col items-center justify-center gap-0 px-5 transition-all duration-200 ease-in-out h-max w-screen md:py-8 lg:px-10 bg-[#171717] backdrop-blur-2xl`}
            >
                <div
                    className={`flex w-full flex-col justify-between ${isExpand && isCommentVisible ? "lg:flex-col" : "lg:flex-row lg:grid lg:grid-cols-3"}`}
                >
                    {/* detail */}
                    <div className={`flex w-full items-center justify-center gap-3 lg:mt-0 lg:max-w-md rounded-xl transition-all duration-300 ease-in-out cursor-pointer`}>
                        {!isExpand && (
                            <div className="relative h-16 w-20">
                                <Image
                                    src={
                                        coverEpisodeUrl || "https://picsum.photos/seed/eps6/800/450"
                                    }
                                    alt="cover-podcast"
                                    className="rounded-sm object-cover object-center"
                                    fill
                                    priority
                                />
                            </div>
                        )}
                        <div
                            className={`flex w-full justify-between lg:max-w-md`}
                        >
                            {/* titile */}
                            <div className="flex flex-col items-start justify-start">
                                <h3 className="zeinFont text-2xl font-extrabold text-white">
                                    {title ? title : "No Playing Podcast"}
                                </h3>
                                <Link href={`/creator/${creatorId}`} className="montserratFont hover:underline line-clamp-2 text-xs text-white/50">
                                    {creatorName ? creatorName : "Unknown Creator"}
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* control play */}
                    <div
                        className={`flex w-full items-center px-2 lg:px-0 justify-between lg:justify-center`}
                    >
                        <div
                            className={`lg:hidden flex items-center justify-center`}
                        >
                            <button
                                className="relative h-5.5 w-5.5 cursor-pointer rounded-full transition-transform duration-150 active:scale-90 lg:h-6 lg:w-6"
                                onClick={handleExpand}
                            >
                                {isExpand ? (
                                    <Image
                                        src={iconCollapse}
                                        alt="icon-backward"
                                        priority
                                        fill
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <Image
                                        src={iconExpand}
                                        alt="icon-backward"
                                        priority
                                        fill
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </button>
                        </div>
                        <div className={`${isMobile ? "max-h-[70px]" : "h-fit"} flex items-center justify-center overflow-hidden`}>
                            {hasPrevEpisodeAvailable && (
                                <button className="relative h-16 w-10 transition-transform duration-150 active:scale-90 lg:w-16" onClick={handlePrevEpisode}>
                                    <Image
                                        src={iconBackward}
                                        alt="icon-backward"
                                        priority
                                        fill
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            )}
                            <button
                                className="relative h-16 w-10 cursor-pointer transition-transform duration-150 active:scale-90 lg:w-16"
                                onClick={handleSeekBackward}
                            >
                                <Image
                                    src={iconBack10Seconds}
                                    alt="icon-backward"
                                    priority
                                    fill
                                    className="h-full w-full object-cover"
                                />
                            </button>
                            <button
                                className="relative h-20 w-14 cursor-pointer transition-transform duration-150 active:scale-90 lg:w-20"
                                onClick={handlePlay}
                            >
                                {isPlay ? (
                                    <Image
                                        src={iconPause}
                                        alt="icon-backward"
                                        priority
                                        fill
                                        className="h-full w-full scale-90 object-cover"
                                    />
                                ) : (
                                    <Image
                                        src={iconPlay}
                                        alt="icon-backward"
                                        priority
                                        fill
                                        className="h-full w-full object-cover transition-transform duration-150 active:scale-90"
                                    />
                                )}
                            </button>
                            <button
                                className="relative h-16 w-10 cursor-pointer transition-transform duration-150 active:scale-90 lg:w-16"
                                onClick={handleSeekForward}
                            >
                                <Image
                                    src={iconNext10Seconds}
                                    alt="icon-next"
                                    priority
                                    fill
                                    className="h-full w-full object-cover"
                                />
                            </button>
                            {hasNextEpisodeAvailable && (
                                <button className="relative h-16 w-10 transition-transform duration-150 active:scale-90 lg:w-16" onClick={handleNextEpisode}>
                                    <Image
                                        src={iconForward}
                                        alt="icon-backward"
                                        priority
                                        fill
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            )}
                        </div>
                        <div
                            className={`lg:hidden relative flex items-center justify-center gap-2`}
                            ref={volumeSliderRef}
                        >
                            {isExpand && isCommentVisible && (
                                <button
                                    className="relative h-6 w-6 cursor-pointer rounded-full transition-transform duration-150 active:scale-90"
                                    onClick={handleViewComments}
                                >
                                    <Image
                                        src={iconComment}
                                        alt="icon-backward"
                                        priority
                                        fill
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            )}
                            <div className="relative flex items-center justify-center">
                                <button
                                    className="relative z-10 ml-2 h-5.5 w-5.5 cursor-pointer transition-transform duration-150 active:scale-90 lg:h-6 lg:w-6"
                                    onClick={toggleVolumeSlider}
                                >
                                    <Image
                                        src={iconVolumeUp}
                                        alt="icon-volume-up"
                                        priority
                                        fill
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                                {isVolumeVisible && (
                                    <div
                                        className={`absolute bottom-[115%] left-1/2 flex h-[110px] w-8 -translate-x-1/2 items-center justify-center rounded-md bg-black/40 backdrop-blur-2xl`}
                                    >
                                        <input
                                            type="range"
                                            name="volume"
                                            id="volume"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={volume}
                                            onChange={handleVolumeChange}
                                            className="h-1 w-[100px] rotate-[-90deg] cursor-pointer appearance-none rounded-full accent-blue-500"
                                            style={{
                                                background: `linear-gradient(to right, #3b82f6 ${volume * 100}%, rgba(255,255,255,0.5) ${volume * 100}%)`,
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* another menu */}
                    {(!isExpand || (!isCommentVisible && isExpand)) && (
                        <div className="hidden items-center justify-end gap-3 lg:flex lg:max-w-full">
                            <button
                                className="relative h-6 w-6 cursor-pointer rounded-full transition-transform duration-150 active:scale-90"
                                onClick={handleExpand}
                            >
                                {isExpand ? (
                                    <Image
                                        src={iconCollapse}
                                        alt="icon-backward"
                                        priority
                                        fill
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <Image
                                        src={iconExpand}
                                        alt="icon-backward"
                                        priority
                                        fill
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </button>
                            <button
                                className="relative h-6 w-6 cursor-pointer rounded-full transition-transform duration-150 active:scale-90"
                                onClick={handleViewComments}
                            >
                                <Image
                                    src={iconComment}
                                    alt="icon-backward"
                                    priority
                                    fill
                                    className="h-full w-full object-cover"
                                />
                            </button>
                            <div className="flex items-center justify-end gap-1">
                                <button
                                    className="relative h-6 w-6 transition-transform duration-150 active:scale-90"
                                    onClick={handleDecreaseVolume}
                                >
                                    <Image
                                        src={iconVolumeDown}
                                        alt="icon-backward"
                                        priority
                                        fill
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                                <input
                                    type="range"
                                    name="volume"
                                    id="volume"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="range-slider cursor-pointer accent-blue-500"
                                    style={{
                                        "--progress": `${volume * 100}%`,
                                    }}
                                />
                                <button
                                    className="relative ml-2 h-6 w-6 transition-transform duration-150 active:scale-90"
                                    onClick={handleIncreaseVolume}
                                >
                                    <Image
                                        src={iconVolumeUp}
                                        alt="icon-backward"
                                        priority
                                        fill
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

AudioControl.propTypes = {
    coverEpisodeUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    creatorName: PropTypes.string.isRequired,
    creatorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currentTime: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    volume: PropTypes.number.isRequired,
    isPlay: PropTypes.bool.isRequired,
    isExpand: PropTypes.bool.isRequired,
    isCommentVisible: PropTypes.bool.isRequired,
    isOpenDetailPodcast: PropTypes.bool,
    isMobile: PropTypes.bool,
    handlePlay: PropTypes.func.isRequired,
    handlePrevEpisode: PropTypes.func,
    handleNextEpisode: PropTypes.func,
    handleSeekBackward: PropTypes.func.isRequired,
    handleSeekForward: PropTypes.func.isRequired,
    handleExpand: PropTypes.func.isRequired,
    handleViewComments: PropTypes.func.isRequired,
    handleDecreaseVolume: PropTypes.func.isRequired,
    handleVolumeChange: PropTypes.func.isRequired,
    handleIncreaseVolume: PropTypes.func.isRequired,
    handleSeek: PropTypes.func.isRequired,
    handleClosePodcast: PropTypes.func.isRequired,
    hasPrevEpisodeAvailable: PropTypes.bool,
    hasNextEpisodeAvailable: PropTypes.bool,
};
