import React from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';

/*[--- COMPONENT IMPORT ---]*/
/*[--- ASSETS IMPORT ---]*/
import iconFlag from "@@/icons/icons-flag.svg";
import BackButton from '../BackButton/page';
import { useRouter } from "next/navigation";

export default function ExpandView({
    coverEpisodeUrl,
    title,
    description,
    duration,
    currentTime,
    handleExpand,
}) {
    const router = useRouter();
    return (
        <div className="flex w-full h-[calc(100vh-120px)] bg-[#786151]">
            {/* Main Area */}
            <div className="w-full flex flex-col items-center justify-center relative px-6 py-10 lg:py-16 pb-32">
                {/* Top bar: back & report */}
                <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-6">
                    <BackButton onClick={() => {
                        router.back(); 
                        handleExpand();
                    }} />
                    <button className="relative h-8 w-8 cursor-pointer transition-transform duration-150 active:scale-90">
                        <Image
                            priority
                            src={iconFlag}
                            alt="icon-flag"
                            className="object-cover object-center"
                            fill
                        />
                    </button>
                </div>

                {/* Cover */}
                <figure className="relative w-[90vw] max-w-[600px] aspect-square rounded-md shadow-2xl overflow-hidden">
                    {coverEpisodeUrl && (
                        <Image
                            priority
                            src={coverEpisodeUrl}
                            alt="Cover Episode"
                            className={`object-cover object-center transition-all duration-200 ease-in-out ${duration && (duration - currentTime <= 15) ? "opacity-25" : "opacity-100"}`}
                            fill
                        />
                    )}
                    {duration && duration - currentTime <= 15 && (
                        <p className="h-full flex justify-center items-center zeinFont lg:text-3xl text-2xl text-white font-bold leading-6 p-5 text-center">
                            Terima kasih sudah mendengarkan!
                            <br />
                            <br />
                            Jangan lewatkan kelanjutannya—beli episode selanjutnya dan terus ikuti kisahnya!
                        </p>
                    )}
                </figure>

                {/* Title & description */}
                <div className="w-full max-w-[620px] flex flex-col items-center text-center mt-6">
                    <h3 className="zeinFont text-2xl font-extrabold text-white line-clamp-2">{title}</h3>
                    <p className="montserratFont text-sm text-white/70 line-clamp-3 mt-2">{description}</p>
                </div>
            </div>
        </div>
    )
}

ExpandView.propTypes = {
    episodeId: PropTypes.string.isRequired,
    coverEpisodeUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
    isExpand: PropTypes.bool.isRequired,
    isCommentVisible: PropTypes.bool.isRequired,
    handleViewComments: PropTypes.func.isRequired,
    handleExpand: PropTypes.func.isRequired,
}