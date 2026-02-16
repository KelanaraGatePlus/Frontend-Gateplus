"use client";

import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { Icon } from "@iconify/react";
import logo from "@@/logo/logoGate+/logo-header-login.svg";

export default function AccountStatusModal({ type, reason, suspendedUntil, onClose }) {
    const isBanned = type === "BANNED";
    const isSuspended = type === "SUSPENDED";

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in">
            <div className="bg-[#2A2E35] rounded-2xl max-w-xl w-full text-center p-8 md:p-10 relative overflow-hidden shadow-2xl animate-slide-up">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center transition-all duration-200 hover:rotate-90"
                    aria-label="Close"
                >
                    <Icon icon="mdi:close" className="w-6 h-6 text-gray-400" />
                </button>

                {/* Logo with scale animation */}
                <div className="flex justify-center mb-4 animate-scale-in">
                    <Image
                        src={logo}
                        alt="Gateplus"
                        width={120}
                        height={60}
                        className="object-contain hover:scale-110 transition-transform duration-300"
                        priority
                    />
                </div>

                {/* Animated Icon/Illustration with pulse rings */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        {/* Animated pulse rings */}
                        <div className={`absolute inset-0 rounded-full ${isBanned ? 'bg-red-500' : 'bg-blue-500'} animate-ping-slow opacity-20`}></div>
                        <div className={`absolute inset-0 rounded-full ${isBanned ? 'bg-red-400' : 'bg-blue-400'} animate-ping-slower opacity-10`}></div>
                        
                        {isBanned ? (
                            // Banned - Shield with X
                            <div className="relative w-32 h-32 animate-float">
                                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse-glow"></div>
                                <div className="relative w-full h-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                                    <Icon 
                                        icon="mdi:shield-off" 
                                        className="w-28 h-28 text-red-400 drop-shadow-2xl animate-rotate-shake"
                                    />
                                </div>
                            </div>
                        ) : (
                            // Suspended - Clock/Timer
                            <div className="relative w-32 h-32 animate-float">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse-glow"></div>
                                <div className="relative w-full h-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                                    <Icon 
                                        icon="mdi:clock-alert-outline" 
                                        className="w-28 h-28 text-blue-400 drop-shadow-2xl animate-swing"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Title */}
                <h2 className="text-white text-2xl md:text-3xl font-bold mb-3 montserratFont">
                    {isBanned ? 'Akun Dinonaktifkan' : 'Akun Ditangguhkan'}
                </h2>
                
                {/* Subtitle */}
                <p className="text-gray-400 text-sm md:text-base mb-6 montserratFont max-w-lg mx-auto">
                    {isBanned 
                        ? 'Akun Anda telah dinonaktifkan secara permanen karena melanggar ketentuan layanan'
                        : 'Akun Anda ditangguhkan sementara karena melanggar kebijakan komunitas'
                    }
                </p>

                {/* Info Cards Container */}
                <div className="space-y-4 mb-6">
                    {/* Reason Card */}
                    <div className="bg-[#1F2329] rounded-xl p-6 text-left border border-gray-700/50 hover:border-gray-600 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center flex-shrink-0 hover:rotate-12 transition-transform duration-300">
                                <Icon icon="mdi:information-outline" className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-400 text-sm mb-2 montserratFont font-medium">Alasan Penangguhan</p>
                                <p className="text-gray-200 text-base montserratFont leading-relaxed">
                                    {reason || (isBanned 
                                        ? "Pelanggaran terhadap kebijakan platform." 
                                        : "Pelanggaran terhadap kebijakan komunitas."
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Suspended Until Card (only for suspended) */}
                    {isSuspended && suspendedUntil && (
                        <div className="bg-[#1F2329] rounded-xl p-6 text-left border border-green-700/30 hover:border-green-600/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0 hover:rotate-12 transition-transform duration-300">
                                    <Icon icon="mdi:calendar-clock" className="w-6 h-6 text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-400 text-sm mb-2 montserratFont font-medium">Akun Aktif Kembali</p>
                                    <p className="text-green-400 text-base font-semibold montserratFont">
                                        {formatDate(suspendedUntil)}
                                    </p>
                                    <p className="text-gray-500 text-sm mt-2 montserratFont">
                                        Anda dapat login kembali setelah masa penangguhan berakhir
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Support Info */}
                <div className="bg-[#1F2329]/50 rounded-lg p-4 mb-6 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300">
                    <p className="text-gray-400 text-sm montserratFont">
                        Butuh bantuan atau merasa ini adalah kesalahan?
                    </p>
                    <p className="text-[#3B82F6] hover:text-[#2563EB] cursor-pointer text-sm font-medium montserratFont mt-1 transition-colors">
                        support@gateplus.id
                    </p>
                </div>

                {/* Button */}
                <button
                    onClick={onClose}
                    className="w-full max-w-md mx-auto block bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold py-4 rounded-xl transition-all duration-200 montserratFont transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40"
                >
                    Mengerti
                </button>

            </div>

            {/* Custom CSS for Animations */}
            <style jsx>{`
                /* Entrance animations */
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                /* Icon animations */
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-15px);
                    }
                }

                @keyframes swing {
                    0%, 100% {
                        transform: rotate(-8deg);
                    }
                    50% {
                        transform: rotate(8deg);
                    }
                }

                @keyframes rotate-shake {
                    0%, 100% {
                        transform: rotate(0deg);
                    }
                    25% {
                        transform: rotate(-10deg);
                    }
                    75% {
                        transform: rotate(10deg);
                    }
                }

                @keyframes pulse-glow {
                    0%, 100% {
                        opacity: 0.4;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }

                /* Pulse ring animations */
                @keyframes ping-slow {
                    0% {
                        transform: scale(1);
                        opacity: 0.3;
                    }
                    100% {
                        transform: scale(1.8);
                        opacity: 0;
                    }
                }

                @keyframes ping-slower {
                    0% {
                        transform: scale(1);
                        opacity: 0.2;
                    }
                    100% {
                        transform: scale(2.5);
                        opacity: 0;
                    }
                }

                /* Apply animations */
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }

                .animate-slide-up {
                    animation: slide-up 0.4s ease-out;
                }

                .animate-scale-in {
                    animation: scale-in 0.5s ease-out 0.2s both;
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-swing {
                    animation: swing 2s ease-in-out infinite;
                    transform-origin: top center;
                }

                .animate-rotate-shake {
                    animation: rotate-shake 2.5s ease-in-out infinite;
                }

                .animate-pulse-glow {
                    animation: pulse-glow 2s ease-in-out infinite;
                }

                .animate-ping-slow {
                    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }

                .animate-ping-slower {
                    animation: ping-slower 3s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
            `}</style>
        </div>
    );
}

AccountStatusModal.propTypes = {
    type: PropTypes.oneOf(["BANNED", "SUSPENDED"]).isRequired,
    reason: PropTypes.string,
    suspendedUntil: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};