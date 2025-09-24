import React from "react";
import PropTypes from "prop-types";


export default function StaticBannerPromo({ title, bgColor, titleColor, subtitle }) {
    return (
        <div
            className="my-auto h-60 flex w-screen flex-col bg-gradient-to-r from-[#156EB74D]/0 to-[#156EB74D]/0 justify-center px-16"
            style={{
                backgroundImage: `linear-gradient(to right, rgba(21,110,183,0), ${bgColor || '#156EB74D'}, rgba(21,110,183,0))`
            }}
        >
            <h1
                className="font-black zeinFont text-5xl"
                style={{ color: titleColor || '#219BFF' }}
            >
                {title}
            </h1>
            <h2 className="text-white text-[16px]">{subtitle}</h2>
        </div>

    )
}

StaticBannerPromo.propTypes = {
    title: PropTypes.string.isRequired,
    bgColor: PropTypes.string,
    titleColor: PropTypes.string,
    subtitle: PropTypes.string.isRequired
}