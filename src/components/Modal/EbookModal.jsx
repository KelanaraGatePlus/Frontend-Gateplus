import React from 'react';
import PropTypes from 'prop-types';
import { XIcon } from "flowbite-react";

export default function EbookModal({ isOpen, onClose, title, children }) {
    return (
        <div className={`fixed inset-0 flex items-center justify-center max-h-screen overflow-y-scroll z-50 ${isOpen ? '' : 'hidden'}`}>
            {/* Background Overlay */}
            <div className="fixed inset-0 bg-black opacity-40" onClick={onClose}></div>

            {/* Modal Box */}
            <div className="bg-[#393939] rounded-lg p-1 z-50 relative min-w-screen/2 w-max shadow-xl shadow-[#00000040]">
                <div className="flex flex-row w-full justify-between items-center py-1">
                    <h2 className="text-white text-lg font-semibold ">{title}</h2>
                    <button onClick={onClose} className="bg-[#979797] hover:cursor-pointer w-8 h-8 flex items-center justify-center rounded-full">
                        <XIcon className="text-white w-full h-full p-2" />
                    </button>
                </div>

                <div className="flex justify-between w-full py-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

EbookModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    children: PropTypes.node
};
