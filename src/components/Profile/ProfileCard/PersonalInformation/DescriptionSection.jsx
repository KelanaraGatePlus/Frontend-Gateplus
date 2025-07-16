import React from 'react';
import PropTypes from 'prop-types';

export default function DescriptionSection({ description }) {
    return (
        <div>
            <p
                className={`min-h-[100px] w-full rounded-md bg-[#2222224D] p-2 text-[12px] text-gray-200 lg:text-base ${!description ? "text-gray-500/60 italic" : ""}`}
            >
                {description || "Tidak ada Deskripsi"}
            </p>
        </div>
    )
}

DescriptionSection.propTypes = {
    description: PropTypes.string.isRequired,
}
