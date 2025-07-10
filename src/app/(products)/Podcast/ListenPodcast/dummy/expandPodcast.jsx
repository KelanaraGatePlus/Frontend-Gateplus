import React from "react";
import Image from "next/image";
import PropTypes from "prop-types";

/*[--- COMPONENT IMPORT ---]*/
import CommentComponent from "@/components/Comment/page";

/*[--- ASSETS IMPORT ---]*/
import iconSaveOutline from "@@/logo/logoDetailFilm/save-icons.svg";
import iconMore from "@@/icons/icons-more.svg";
import iconFlag from "@@/icons/icons-flag.svg";

export default function ExpandPodcast({
  coverEpisodeUrl,
  title,
  description,
  duration,
  currentTime,
  isExpand,
  isCommentVisible,
  handleViewComments,
}) {
  return (
    <div className="flex h-[72%] w-full">
      <div
        className={`relative flex items-center justify-center rounded-lg transition-all duration-200 ease-in-out ${isCommentVisible ? "h-auto w-1/2 overflow-x-hidden bg-transparent lg:pr-5 lg:pl-10" : "m-2 w-full bg-[#786151]"}`}
      >
        <figure
          className={`relative h-[250px] w-[250px] overflow-hidden rounded-lg shadow-2xl transition-all duration-200 ease-in-out lg:h-[75%] lg:w-[30%] ${isCommentVisible ? "lg:h-[90%] lg:w-full" : "lg:h-[75%] lg:w-[30%]"}`}
        >
          {coverEpisodeUrl && (
            <Image
              priority
              src={coverEpisodeUrl}
              alt="Cover Episode"
              className={`object-cover object-center transition-all duration-200 ease-in-out ${duration && duration - currentTime <= 15 ? "opacity-25" : "opacity-100"}`}
              fill
            />
          )}
          {duration && duration - currentTime <= 15 && (
            <p className="zeinFont flex h-full items-center justify-center p-5 text-left text-2xl leading-6 font-bold text-white lg:text-3xl">
              Terima kasih sudah mendengarkan!
              <br />
              <br />
              Jangan lewatkan kelanjutannya—beli episode selanjutnya dan terus
              ikuti kisahnya!
            </p>
          )}
        </figure>
        <button
          className={`absolute h-8 w-8 cursor-pointer opacity-80 transition-transform duration-150 active:scale-90 ${isCommentVisible ? "top-8 right-10" : "top-2 right-2"}`}
        >
          <Image
            priority
            src={iconFlag}
            alt="icon-flag"
            className="object-cover object-center"
            fill
          />
        </button>
        <div className="absolute bottom-0 flex w-full justify-between bg-gradient-to-t from-black/65 to-black/0 px-3 py-3 lg:hidden lg:max-w-md">
          {/* title */}
          <div className="flex flex-col items-start justify-center">
            <h3 className="zeinFont text-2xl font-extrabold text-white">
              {title}
            </h3>
            <p className="montserratFont text-xs text-white/50">
              {description}
            </p>
          </div>

          {/* action */}
          <div className="mx-2 flex items-center gap-2">
            <div className="relative h-6 w-6">
              <Image
                priority
                src={iconSaveOutline}
                alt="icon-save-outline"
                className="rounded object-cover object-center"
                fill
              />
            </div>
            <div className="relative h-6 w-6">
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
      {isCommentVisible && (
        <CommentComponent
          isExpand={isExpand}
          isCommentVisible={isCommentVisible}
          handleViewComments={handleViewComments}
        />
      )}
    </div>
  );
}

ExpandPodcast.propTypes = {
  coverEpisodeUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  currentTime: PropTypes.number.isRequired,
  isExpand: PropTypes.bool.isRequired,
  isCommentVisible: PropTypes.bool.isRequired,
  handleViewComments: PropTypes.func.isRequired,
};
