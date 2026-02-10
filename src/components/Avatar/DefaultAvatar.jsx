import React from 'react';
import PropTypes from 'prop-types';
export default function DefaultAvatar({ src, size = 40 }) {
    return (
        <img
            src={src || '/default-avatar.png'}
            alt="Avatar"
            className="rounded-full object-cover"
            style={{ width: size, height: size }}
        />
    );
}

DefaultAvatar.propTypes = {
    src: PropTypes.string,
    size: PropTypes.number,
};