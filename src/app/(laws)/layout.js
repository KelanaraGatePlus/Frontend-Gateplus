"use client";
import React from 'react';
import PropTypes from 'prop-types';

export default function LawsLayout({ children }) {
    return (
        <div className="flex flex-col overflow-x-hidden">
            <div className="flex flex-col">{children}</div>
        </div>
    );
}

LawsLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
