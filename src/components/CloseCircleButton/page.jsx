import React from 'react';
import PropTypes from 'prop-types';

export default function CloseCircleButton({ onClose }) {
    return (
        <div
            onClick={onClose}
            className="absolute hidden md:flex top-4 left-12 p-2 h-6 w-6 rounded-full bg-gray-500 hover:bg-gray-600 transition duration-200 text-white text-xl font-semibold items-center justify-center shadow-md cursor-pointer"
        >
            <p className="flex items-center justify-center h-6 w-6 text-white text-lg -mt-0.5">
                &times;
            </p>
        </div>
    )
}

CloseCircleButton.propTypes = {
    onClose: PropTypes.func,

};
