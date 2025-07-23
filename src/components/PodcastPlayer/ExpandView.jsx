import React from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';

/*[--- COMPONENT IMPORT ---]*/
import CommentComponent from '@/components/Comment/page';

/*[--- ASSETS IMPORT ---]*/
import iconSaveOutline from "@@/logo/logoDetailFilm/save-icons.svg";
import iconMore from "@@/icons/icons-more.svg";
import iconFlag from "@@/icons/icons-flag.svg";

export default function ExpandView({
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
        <div className='flex w-full h-[72vh]'>
            <div className={`flex justify-center flex-col rounded-lg relative transition-all duration-200 ease-in-out ${isCommentVisible ? 'w-1/2 h-auto overflow-hidden items-start mt-5 bg-transparent lg:pl-10 lg:pr-5' : 'items-center w-full m-2 bg-[#786151]'}`}>
                <figure className={`bg-amber-400 relative lg:h-[75%] lg:w-[30%] h-[250px] w-[250px] rounded-lg shadow-2xl overflow-hidden transition-all duration-200 ease-in-out ${isCommentVisible ? 'lg:w-full lg:h-[80%]' : 'lg:h-[75%] lg:w-[30%]'}`}>
                    {coverEpisodeUrl && (
                        <Image
                            priority
                            src={coverEpisodeUrl}
                            alt="Cover Episode"
                            className={`object-cover object-center transition-all duration-200 ease-in-out ${duration && (duration - currentTime <= 15) ? "opacity-25" : "opacity-100"}`}
                            fill
                        />
                    )}
                    {
                        (duration) && (
                            (duration - currentTime <= 15) && (
                                <p className="text-left h-full flex justify-center items-center zeinFont lg:text-3xl text-2xl text-white font-bold leading-6 p-5">
                                    Terima kasih sudah mendengarkan!
                                    <br />
                                    <br />
                                    Jangan lewatkan kelanjutannya—beli episode selanjutnya dan terus ikuti kisahnya!
                                </p>
                            )
                        )
                    }
                    <button className={`active:scale-90 transition-transform duration-150 absolute w-8 h-8 opacity-80 cursor-pointer top-2 right-2`}>
                        <Image
                            priority
                            src={iconFlag}
                            alt="icon-flag"
                            className="object-cover object-center"
                            fill
                        />
                    </button>
                </figure>
                <div className={`${isExpand && !isCommentVisible && "lg:hidden"} w-full flex justify-between absolute bottom-0 ${isExpand && isCommentVisible ? "py-1 px-0 bg-transparent w-full static" : "py-3 px-3 bg-gradient-to-t from-black/65 to-black/0 lg:max-w-md"}`}>
                    {/* title */}
                    <div className='flex flex-col items-start justify-center'>
                        <h3 className='zeinFont text-2xl font-extrabold text-white'>{title}</h3>
                        <p className='montserratFont text-xs text-white/50 line-clamp-1'>{description}</p>
                    </div>

                    {/* action */}
                    <div className='flex items-center gap-2 mx-2'>
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
                                className="rounded object-cover object-center rotate-90"
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
    )
}

ExpandView.propTypes = {
    coverEpisodeUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
    isExpand: PropTypes.bool.isRequired,
    isCommentVisible: PropTypes.bool.isRequired,
    handleViewComments: PropTypes.func.isRequired,
}