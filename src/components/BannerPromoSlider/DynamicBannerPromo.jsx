import React from "react";
import PropTypes from "prop-types";
import IconSearch from "@@/icons/icon-search.svg";
import Image from "next/image";

export default function DynamicBannerPromo({ title, bgColor, titleColor, subtitle, filter }) {
    return (
        <div
            className="my-auto md:h-80 py-20 md:py-0 flex w-screen flex-col gap-8 bg-gradient-to-r from-[#156EB74D]/0 to-[#156EB74D]/0 justify-center md:px-16 px-4"
            style={{
                backgroundImage: `linear-gradient(to right, rgba(21,110,183,0), ${bgColor || '#156EB74D'}, rgba(21,110,183,0))`
            }}
        >
            <div className="flex flex-row items-center gap-2 md:gap-6">
                <Image
                    src={IconSearch}
                    alt="Dynamic Banner Left"
                    width={54}
                    height={54}
                    className="object-cover w-6 md:w-[54px]"
                />
                <div>
                    <h1
                        className="font-black zeinFont text-2xl md:text-5xl"
                        style={{ color: titleColor || '#219BFF' }}
                    >
                        {title}
                    </h1>
                    <h2 className="text-white text-[16px]">{subtitle}</h2>
                </div>
            </div>
            <div className="flex md:flex-row flex-col gap-4 md:w-full w-3/4">
                {filter}
            </div>
        </div>
    )
}

DynamicBannerPromo.propTypes = {
    title: PropTypes.string.isRequired,
    bgColor: PropTypes.string,
    titleColor: PropTypes.string,
    subtitle: PropTypes.string.isRequired,
    filter: PropTypes.node
}