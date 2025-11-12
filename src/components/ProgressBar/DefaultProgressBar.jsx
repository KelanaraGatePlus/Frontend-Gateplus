import PropTypes from "prop-types";
import React from "react";

export default function DefaultProgressBar({ progress = 0, backgroundColor = '#515151', barColor = '#1FC16B', borderColor = 'transparent'}) {
    return (
        <div className="w-full rounded-full" style={{ backgroundColor: backgroundColor, border: '1px solid', borderColor: borderColor}}>
            <div className="h-4 rounded-full" style={{ width: `${progress}%`, backgroundColor: barColor }}></div>
        </div>
    )
}

DefaultProgressBar.propTypes = {
    progress: PropTypes.number,
    backgroundColor: PropTypes.string,
    barColor: PropTypes.string,
    borderColor: PropTypes.string,
};
