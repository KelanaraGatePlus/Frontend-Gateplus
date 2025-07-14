import React from 'react';
import PropTypes from 'prop-types';

export default function BottomSpacer({ height = "h-20", isMobileHidden = false }) {
    return (
        <div className={`${isMobileHidden ? "hidden md:block" : "block"} w-full bg-transparent text-transparent ${height}`}>
            {"GatePlus"}
        </div>
    )
}

BottomSpacer.propTypes = {
    height: PropTypes.string,
    isMobileHidden: PropTypes.bool,
}