"use client";

import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";

export const CommentMenu = ({ 
    onReport, 
    onReply, 
    onCopy, 
    onDelete, // ⬅️ TAMBAHKAN
    showDelete = false, // ⬅️ TAMBAHKAN
    isDark 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAction = (action) => {
        action();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Menu komentar"
            >
                <Icon
                    icon="solar:menu-dots-bold-duotone"
                    className={`h-6 w-6 ${isDark ? "text-white" : "text-gray-700"}`}
                />
            </button>

            {isOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 overflow-hidden ${isDark ? "bg-[#2A2A2A] border border-white/10" : "bg-white border border-gray-200"}`}>
                    <button
                        onClick={() => handleAction(onReply)}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${isDark ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-gray-700"}`}
                    >
                        <Icon icon="solar:reply-bold-duotone" className="w-5 h-5" />
                        <span className="text-sm font-medium">Balas</span>
                    </button>

                    <button
                        onClick={() => handleAction(onCopy)}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${isDark ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-gray-700"}`}
                    >
                        <Icon icon="solar:copy-bold-duotone" className="w-5 h-5" />
                        <span className="text-sm font-medium">Salin</span>
                    </button>

                    {/* ⬇️ TAMBAHKAN OPSI HAPUS */}
                    {showDelete && (
                        <>
                            <div className={`h-px ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
                            <button
                                onClick={() => handleAction(onDelete)}
                                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors text-orange-500 hover:bg-orange-500/10`}
                            >
                                <Icon icon="solar:trash-bin-trash-bold-duotone" className="w-5 h-5" />
                                <span className="text-sm font-medium">Hapus</span>
                            </button>
                        </>
                    )}

                    <div className={`h-px ${isDark ? "bg-white/10" : "bg-gray-200"}`} />

                    <button
                        onClick={() => handleAction(onReport)}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors text-red-500 hover:bg-red-500/10`}
                    >
                        <Icon icon="solar:danger-triangle-bold-duotone" className="w-5 h-5" />
                        <span className="text-sm font-medium">Laporkan</span>
                    </button>
                </div>
            )}
        </div>
    );
};

CommentMenu.propTypes = {
    onReport: PropTypes.func.isRequired,
    onReply: PropTypes.func.isRequired,
    onCopy: PropTypes.func.isRequired,
    onDelete: PropTypes.func, // ⬅️ TAMBAHKAN
    showDelete: PropTypes.bool, // ⬅️ TAMBAHKAN
    isDark: PropTypes.bool,
};