import React from "react";
import PropTypes from "prop-types";

export default function SimpleModal({ isOpen, onClose, onConfirm, title }) {
    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
            {/* Background Overlay */}
            <div className="fixed inset-0 bg-black opacity-40" onClick={onClose}></div>

            {/* Modal Box */}
            <div className="bg-[#1668B6] rounded-md p-4 z-50 relative w-[400px]">
                <h2 className="text-white text-lg font-semibold mb-6">{title}</h2>

                <div className="flex justify-between w-full">
                    <button
                        onClick={onConfirm}
                        className="text-white font-semibold w-full hover:cursor-pointer"
                    >
                        Ya
                    </button>

                    <button
                        onClick={onClose}
                        className="bg-[#163D91] text-white font-semibold py-1 px-4 rounded-md w-full hover:cursor-pointer"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
}

SimpleModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};
