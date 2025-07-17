import React from 'react';
import PropTypes from 'prop-types';

export default function NameSection({ profileName, username }) {
    return (
        <div className="text-white">
            <h1
                className={`zeinFont mt-2 text-[28px] leading-6 font-semibold lg:text-3xl ${!profileName ? "text-gray-500/60" : ""
                    }`}
            >
                {profileName || "Nama Profile Belum di atur"}
            </h1>
            <div className="flex items-center gap-1 text-sm text-[12px] text-gray-300 lg:text-base">
                <p>@{username}</p>
            </div>
        </div>
    )
}

NameSection.propTypes = {
    profileName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
}
