"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import PropTypes from "prop-types";

/*[--- ASSETS IMPORT ---]*/
import iconSaveOutline from "@@/logo/logoDetailFilm/save-icons.svg";
import iconMore from "@@/icons/icons-more.svg";
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

export default function AudioControl({
  coverEpisodeUrl,
  title,
  description,
  currentTime,
  duration,
  volume,
  isPlay,
  isExpand,
  isCommentVisible,
  handleSeekBackward,
  handleSeekForward,
  handlePlay,
  handleExpand,
  handleViewComments,
  handleDecreaseVolume,
  handleVolumeChange,
  handleIncreaseVolume,
  handleSeek,
}) {
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const volumeSliderRef = useRef(null);
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00:00";
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = Math.floor(time % 60);
    return [hrs, mins, secs].map((v) => String(v).padStart(2, "0")).join(":");
  };

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
    <div
      className={`z-40 flex flex-col items-center gap-2 bg-[#171717] px-5 transition-all duration-200 ease-in-out ${isExpand && isCommentVisible ? "w-1/2 lg:pl-10" : "w-full lg:p-4 lg:px-10"}`}
    >
      <div
        className={`flex w-full flex-col justify-between lg:grid lg:grid-cols-3 ${isExpand && isCommentVisible ? "lg:flex-col" : "lg:flex-row"}`}
      >
        {/* detail */}
        <div className="mt-2 flex w-full items-center justify-center gap-3 lg:mt-0 lg:max-w-md">
          {!isExpand && (
            <div className="relative h-16 w-20">
              <Image
                src={
                  coverEpisodeUrl || "https://picsum.photos/seed/eps6/800/450"
                }
                alt="cover-podcast"
                className="rounded-lg object-cover object-center"
                fill
                priority
              />
            </div>
          )}
          <div
            className={`flex w-full justify-between ${isExpand && isCommentVisible ? "-mt-4 mb-2 w-full" : "lg:max-w-md"} ${isExpand ? "hidden lg:flex" : "flex"}`}
          >
            {/* titile */}
            <div className="flex flex-col items-start justify-center">
              <h3 className="zeinFont text-2xl font-extrabold text-white">
                {title}
              </h3>
              <p className="montserratFont line-clamp-2 text-xs text-white/50">
                {description}
              </p>
            </div>

            {/* action */}
            <div className="mx-2 flex items-center gap-2">
              <div className="relative h-6 w-6 cursor-pointer transition-transform duration-150 active:scale-90">
                <Image
                  priority
                  src={iconSaveOutline}
                  alt="icon-save-outline"
                  className="rounded object-cover object-center"
                  fill
                />
              </div>
              <div className="relative h-6 w-6 cursor-pointer transition-transform duration-150 active:scale-90">
                <Image
                  priority
                  src={iconMore}
                  alt="icon-more"
                  className="rotate-90 rounded object-cover object-center"
                  fill
                />
              </div>
            </div>
          </div>
        </div>

        {/* control play */}
        <div
          className={`flex w-full items-center px-2 lg:px-0 ${isExpand && isCommentVisible ? "justify-between" : "justify-between lg:justify-center"}`}
        >
          <div
            className={` ${isExpand && isCommentVisible ? "lg:flex" : "lg:hidden"} flex items-center justify-center`}
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
          <div className="flex items-center justify-center">
            <button className="relative h-16 w-10 transition-transform duration-150 active:scale-90 lg:w-16">
              <Image
                src={iconBackward}
                alt="icon-backward"
                priority
                fill
                className="h-full w-full object-cover"
              />
            </button>
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
            <button className="relative h-16 w-10 transition-transform duration-150 active:scale-90 lg:w-16">
              <Image
                src={iconForward}
                alt="icon-backward"
                priority
                fill
                className="h-full w-full object-cover"
              />
            </button>
          </div>
          <div
            className={`${isExpand && isCommentVisible ? "lg:flex" : "lg:hidden"} relative flex items-center justify-center gap-2`}
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
          <div className="hidden items-center justify-end gap-3 lg:flex lg:max-w-md">
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
            <div className="flex items-center justify-center gap-1">
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

      <div
        className={`mb-5 flex w-full flex-col ${isExpand && isCommentVisible ? "-mt-2" : "mt-2"}`}
      >
        <div className="montserratFont flex justify-between text-xs text-white">
          <p>{formatTime(currentTime)}</p>
          <p>{formatTime(duration)}</p>
        </div>
        <div className="flex justify-between">
          <input
            type="range"
            name="track"
            id="track"
            className="w-full cursor-pointer accent-blue-500"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
          />
        </div>
      </div>
    </div>
  );
}

AudioControl.propTypes = {
  coverEpisodeUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  volume: PropTypes.number.isRequired,
  isPlay: PropTypes.bool.isRequired,
  isExpand: PropTypes.bool.isRequired,
  isCommentVisible: PropTypes.bool.isRequired,
  handlePlay: PropTypes.func.isRequired,
  handleSeekBackward: PropTypes.func.isRequired,
  handleSeekForward: PropTypes.func.isRequired,
  handleExpand: PropTypes.func.isRequired,
  handleViewComments: PropTypes.func.isRequired,
  handleDecreaseVolume: PropTypes.func.isRequired,
  handleVolumeChange: PropTypes.func.isRequired,
  handleIncreaseVolume: PropTypes.func.isRequired,
  handleSeek: PropTypes.func.isRequired,
};
