import React from 'react';
import PropTypes from 'prop-types';

import VerifiedCreator from '../../VerifiedCreator';

export default function NameSection({ profileName, username, isVerified = false }) {
    return (
        <div className="w-full text-white">
            <h1
                className={`zeinFont mt-2 text-[28px] font-semibold whitespace-normal wrap-break-word lg:text-3xl ${!profileName ? "text-gray-500/60" : ""
                    }`}
            >
                {profileName || "Nama Profile Belum di atur"}
                <VerifiedCreator
                    isVerified={isVerified}
                />
            </h1>
            <div className="mt-1 text-[12px] text-gray-300 lg:text-base">
                <p className="whitespace-normal break-all">@{username}</p>
            </div>
        </div>
    )
}

NameSection.propTypes = {
    profileName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    isVerified: PropTypes.bool,
}
