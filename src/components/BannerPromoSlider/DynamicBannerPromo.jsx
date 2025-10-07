import React from "react";
import PropTypes from "prop-types";
import IconSearch from "@@/icons/icon-search.svg";
import Image from "next/image";

export default function DynamicBannerPromo({ title, bgColor, titleColor, subtitle, filter }) {
    return (
        <div
            className="my-auto h-80 flex w-screen flex-col gap-8 bg-gradient-to-r from-[#156EB74D]/0 to-[#156EB74D]/0 justify-center px-16"
            style={{
                backgroundImage: `linear-gradient(to right, rgba(21,110,183,0), ${bgColor || '#156EB74D'}, rgba(21,110,183,0))`
            }}
        >
            <div className="flex flex-row items-center gap-6">
                <Image
                    src={IconSearch}
                    alt="Dynamic Banner Left"
                    width={54}
                    height={54}
                    className="object-cover"
                />
                <div>
                    <h1
                        className="font-black zeinFont text-5xl"
                        style={{ color: titleColor || '#219BFF' }}
                    >
                        {title}
                    </h1>
                    <h2 className="text-white text-[16px]">{subtitle}</h2>
                </div>
            </div>
            <div className="flex flex-row gap-4">
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