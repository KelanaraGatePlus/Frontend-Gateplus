import React from 'react';
import PropTypes from 'prop-types';
import { XIcon } from "flowbite-react";

export default function EducationModal({ isOpen, onClose, title, children }) {
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto ${isOpen ? '' : 'hidden'}`}>
            {/* Background Overlay */}
            <div className="fixed inset-0 bg-black opacity-40" onClick={onClose}></div>

            {/* Modal Box */}
            <div className="relative z-50 w-full max-w-5xl bg-[#515151] rounded-lg p-4 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex flex-row w-full justify-between items-center py-1">
                    <h2 className="text-white text-lg font-semibold ">{title}</h2>
                    <button onClick={onClose} className="bg-[#979797] hover:cursor-pointer w-8 h-8 flex items-center justify-center rounded-full">
                        <XIcon className="text-white w-full h-full p-2" />
                    </button>
                </div>

                <div className="flex justify-between w-full py-10">
                    {children}
                </div>
            </div>
        </div>
    );
}

EducationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    children: PropTypes.node
};
