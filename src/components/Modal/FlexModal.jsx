"use client";
import React from "react";
import PropTypes from "prop-types";
import { XIcon } from "flowbite-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FlexModal({ isOpen, onClose, title, children }) {
    return (
        <AnimatePresence mode="wait" initial={false}>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center max-h-screen overflow-y-auto z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                >
                    {/* Background Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        onClick={onClose}
                    />

                    {/* Modal Box */}
                    <motion.div
                        initial={{ scale: 0.96, y: 24, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.98, y: 10, opacity: 0 }}
                        transition={{
                            scale: {
                                type: "spring",
                                stiffness: 180,
                                damping: 24,
                                mass: 0.9,
                            },
                            y: {
                                type: "spring",
                                stiffness: 180,
                                damping: 24,
                                mass: 0.9,
                            },
                            opacity: { duration: 0.18, ease: "easeOut" },
                        }}
                        className="bg-[#515151] rounded-xl p-6 relative min-w-100 w-max shadow-2xl will-change-[transform,opacity]"
                    >
                        <div className="flex justify-between items-center py-1">
                            <h2 className="text-white text-lg font-semibold">
                                {title}
                            </h2>

                            <button
                                onClick={onClose}
                                className="bg-[#979797] hover:cursor-pointer w-8 h-8 flex items-center justify-center rounded-full"
                            >
                                <XIcon className="text-white w-full h-full p-2" />
                            </button>
                        </div>

                        <div className="flex justify-between w-full py-6">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

FlexModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    children: PropTypes.node,
};