import React from 'react';
import PropTypes from 'prop-types';

export default function ContentUnavailableMessage({
    headerMessage,
    descriptionMessage,
}) {
    return (
        <div className="flex flex-col items-center p-4 text-white">
            <h3 className="zeinFont text-center text-3xl font-bold">
                {headerMessage}
            </h3>
            <p className="montserratFont text-center text-sm">
                {descriptionMessage}
            </p>
        </div>
    )
}

ContentUnavailableMessage.propTypes = {
    headerMessage: PropTypes.string.isRequired,
    descriptionMessage: PropTypes.string.isRequired,
}
