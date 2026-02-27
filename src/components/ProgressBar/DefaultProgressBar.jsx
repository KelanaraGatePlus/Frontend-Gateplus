import PropTypes from "prop-types";
import React from "react";

export default function DefaultProgressBar({ progress = 0, backgroundColor = '#515151', height = '16px', barColor = '#1FC16B', borderColor = 'transparent'}) {
    return (
        <div className="w-full rounded-full" style={{ backgroundColor: backgroundColor, border: '1px solid', borderColor: borderColor, height: height }}>
            <div className="rounded-full" style={{ width: `${progress}%`, backgroundColor: barColor, height: height }}></div>
        </div>
    )
}

DefaultProgressBar.propTypes = {
    progress: PropTypes.number,
    backgroundColor: PropTypes.string,
    height: PropTypes.string,
    barColor: PropTypes.string,
    borderColor: PropTypes.string,
};
